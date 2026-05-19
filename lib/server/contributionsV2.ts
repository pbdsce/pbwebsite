/* eslint-disable @typescript-eslint/no-explicit-any */
import connectDB from "@/lib/db/connection";
import Contribution from "@/lib/db/models/contributionsV2";
import Org from "@/lib/db/models/orgsV2";
import User from "@/lib/db/models/users";
//import { getOrgTag } from "@/lib/data/orgs";
import { refreshOrgTagCache } from "@/lib/data/orgs";
import { getOrgTagSync } from "@/lib/data/orgs";
import {
  fetchGitHubMergedPRs,
  clearGitHubCaches,
  extractOrgLogin,
  createOctokit, 
} from "./scrapers/github";
import {
  fetchGitLabMergedMRs,
  resolveGitLabUserId,
  gitlabHeaders,   
} from "./scrapers/gitlab";
import type { RawContribution } from "./scrapers/types";

function splitOrgLinks(links: string[]): {
  github: string[];
  gitlab: string[];
} {
  const github: string[] = [];
  const gitlab: string[] = [];

  for (const raw of links) {
    try {
      const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      if (url.hostname.includes("github.com")) github.push(raw);
      else if (url.hostname.includes("gitlab.com")) gitlab.push(raw);
    } catch {}
  }

  return { github, gitlab };
}

async function saveContributions(
  contributions: RawContribution[]
): Promise<void> {
  if (contributions.length === 0) return;
 
  const orgsMap = new Map<
    string,
    {
      login: string;
      avatarUrl: string;
      htmlUrl: string;
      platform: "github" | "gitlab";
    }
  >();
 
  for (const c of contributions) {
    const key = `${c.orgLogin.toLowerCase()}:${c.platform}`;
    if (!orgsMap.has(key)) {
      orgsMap.set(key, {
        login: c.orgLogin,
        avatarUrl: c.orgAvatarUrl,
        htmlUrl: c.orgHtmlUrl,
        platform: c.platform,
      });
    }
  }
 
  // Save orgs
  for (const org of orgsMap.values()) {
    const update: Record<string, any> = {
      platform: org.platform,
      lastFetched: new Date(),
    };
    if (org.avatarUrl) update.avatarUrl = org.avatarUrl;
    if (org.htmlUrl) update.htmlUrl = org.htmlUrl;
 
    await Org.findOneAndUpdate(
      { login: org.login.toLowerCase(), platform: org.platform },
      { $set: update },
      { upsert: true }
    );
  }
 
  for (const c of contributions) {
    const setFields: Record<string, any> = {
      memberName:   c.memberName,
      username:     c.username,
      platform:     c.platform,
      repoFullName: c.repoFullName,
      orgLogin:     c.orgLogin,
      title:        c.title,
      url:          c.url,
      mergedAt:     c.mergedAt,
      tag:          getOrgTagSync(c.orgLogin),
      scrapedAt:    new Date(),
      orgAvatarUrl: c.orgAvatarUrl ?? "",
      orgHtmlUrl:   c.orgHtmlUrl   ?? "",
    };
    if (c.desc != null && c.desc !== "") {
      setFields.desc = c.desc;
    }

    if (c.userAvatarUrl) {
      setFields.userAvatarUrl = c.userAvatarUrl;
    }
 
    await Contribution.findOneAndUpdate(
      { username: c.username, url: c.url },
      { $set: setFields },
      { upsert: true }
    );
  }
 
  console.log(
    `[DB] Saved ${contributions.length} contributions across ${orgsMap.size} orgs`
  );
}


export async function runScrapeJob(options: {
  incremental?: boolean;
  memberFilter?: string[];
} = {}) {
    await refreshOrgTagCache(); 
  await connectDB();
  clearGitHubCaches();

  const { incremental = false, memberFilter } = options;

  const query: any = memberFilter?.length
    ? { name: { $in: memberFilter } }
    : {};

  const members = await User.find(query).lean();

  if (members.length === 0) {
    throw new Error("No users found.");
  }

  console.log(`[Job] Scraping ${members.length} members`);

  let totalGitHub = 0;
  let totalGitLab = 0;

  for (const member of members) {
    const {
      name,
      githubUsername,
      gitlabUsername,
      customOrgLinks = [],
    } = member;

    let since: Date | undefined;

if (incremental) {
  const WINDOW_DAYS = 10;
  since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

    const { github: githubLinks, gitlab: gitlabLinks } =
      splitOrgLinks(customOrgLinks);

    const all: RawContribution[] = [];

    // GitHub
    if (githubUsername) {
      try {
        console.log(
          `[Job] GitHub → ${githubUsername}` +
            (githubLinks.length
              ? ` | orgs: ${githubLinks
                  .map(extractOrgLogin)
                  .join(", ")}`
              : "")
        );

        const prs = await fetchGitHubMergedPRs({
          username: githubUsername,
          memberName: name,
          customOrgLinks: githubLinks,
          since,
        });

        all.push(...prs);
        totalGitHub += prs.length;
      } catch (err: any) {
        console.error(`[GitHub] ${name}:`, err.message);
      }
    }

    // GitLab
    if (gitlabUsername) {
      try {
        let gitlabId = member.gitlabId ?? null;

        if (!gitlabId) {
          gitlabId = await resolveGitLabUserId(gitlabUsername);
          if (gitlabId) {
            await User.updateOne({ _id: member._id }, { gitlabId });
          }
        }

        if (gitlabId) {
          const mrs = await fetchGitLabMergedMRs({
            username: gitlabUsername,
            memberName: name,
            gitlabUserId: gitlabId,
            customOrgLinks: gitlabLinks,
            since,
          });

          all.push(...mrs);
          totalGitLab += mrs.length;
        }
      } catch (err: any) {
        console.error(`[GitLab] ${name}:`, err.message);
      }
    }

    if (all.length > 0) {
      await saveContributions(all);
    } else {
      console.log(`[Job] No contributions for ${name}`);
    }
  }

  console.log(
    `[Job] Done — GitHub: ${totalGitHub}, GitLab: ${totalGitLab}`
  );
}

export async function getOrgBreakdown(tagFilter?: string) {
  await connectDB();

  const result = await Contribution.aggregate([
    {
      $group: {
        _id: "$orgLogin",
        totalMergedPRs: { $sum: 1 },
        contributors: { $addToSet: "$username" },
        memberNames: { $addToSet: "$memberName" },
        platforms: { $addToSet: "$platform" },
        descriptions: { $addToSet: "$desc" },
        contributionOrgAvatars: { $addToSet: "$orgAvatarUrl" },
        contributionOrgUrls: { $addToSet: "$orgHtmlUrl" },
      },
    },
    {
      $lookup: {
        from: "orgs_v2",
        let: { orgLogin: { $toLower: "$_id" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$login", "$$orgLogin"] } } },
        ],
        as: "orgDetails",
      },
    },
    {
      $project: {
        _id: 0,
        orgLogin: "$_id",
        totalMergedPRs: 1,
        contributors: 1,
        memberNames: 1,
        platforms: 1,
        contributorCount: { $size: "$contributors" },
        orgAvatar: { $arrayElemAt: ["$orgDetails.avatarUrl", 0] },
        orgUrl: { $arrayElemAt: ["$orgDetails.htmlUrl", 0] },
        descriptions: 1,
        contributionOrgAvatars: 1,
        contributionOrgUrls: 1,
      },
    },
    { $sort: { totalMergedPRs: -1 } },
  ]);

  const tagged = result.map((org: any) => {
    const {
      contributionOrgAvatars = [],
      contributionOrgUrls = [],
      ...orgFields
    } = org;
    const descriptions = orgFields.descriptions ?? [];

    return {
      ...orgFields,
      descriptions,
      description: descriptions.find((desc: string) => desc?.trim()) ?? "",
      orgAvatar:
        orgFields.orgAvatar
        ?? contributionOrgAvatars.find((url: string) => url?.trim())
        ?? "",
      orgUrl:
        orgFields.orgUrl
        ?? contributionOrgUrls.find((url: string) => url?.trim())
        ?? "",
      tag: getOrgTagSync(org.orgLogin),
    };
  });

  if (tagFilter) {
    return tagged.filter((o) => o.tag === tagFilter);
  }

  return tagged;
}

export async function getContributorStats(username?: string) {
  await connectDB();
 
  const matchStage: Record<string, any> = {};
  if (username) matchStage.username = username;
 
  const result = await Contribution.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$memberName",
        usernames: { $addToSet: "$username" },
        memberName: { $first: "$memberName" },
        totalMergedPRs: { $sum: 1 },
        githubPRs: {
          $sum: { $cond: [{ $eq: ["$platform", "github"] }, 1, 0] },
        },
        gitlabPRs: {
          $sum: { $cond: [{ $eq: ["$platform", "gitlab"] }, 1, 0] },
        },
        orgs: { $addToSet: "$orgLogin" },
        platforms: { $addToSet: "$platform" },
        userAvatarUrl: { $max: "$userAvatarUrl" },
        descriptions: { $addToSet: "$desc" },
      },
    },
    {
      $project: {
        _id: 0,
        username: { $arrayElemAt: ["$usernames", 0] },
        memberName: 1,
        totalMergedPRs: 1,
        githubPRs: 1,
        gitlabPRs: 1,
        orgs: 1,
        platforms: 1,
        totalOrgs: { $size: "$orgs" },
        userAvatarUrl: 1,
        descriptions: 1,
      },
    },
    { $sort: { totalMergedPRs: -1 } },
  ]);
 
  return result.map((user: any) => ({
    ...user,
    description: user.descriptions?.find((desc: string) => desc?.trim()) ?? "",
    tags: user.orgs.map((org: string) => getOrgTagSync(org)),
  }));
}

export async function getMemberPRs(options: {
  memberName?: string;
  username?: string;
  orgLogin?: string;
  tag?: string;
  platform?: string;
  page?: number;
  limit?: number;
} = {}) {
  await connectDB();

  const page = Math.max(options.page ?? 1, 1);
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200);
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};
  if (options.memberName) query.memberName = options.memberName;
  if (options.username) query.username = options.username;
  if (options.orgLogin) query.orgLogin = options.orgLogin;
  if (options.tag) query.tag = options.tag;
  if (options.platform) query.platform = options.platform;

  const [data, total] = await Promise.all([
    Contribution.find(query, { __v: 0 })
      .sort({ mergedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contribution.countDocuments(query),
  ]);

  return {
    data: data.map((contribution) => ({
      memberName: contribution.memberName,
      username: contribution.username,
      platform: contribution.platform,
      repoFullName: contribution.repoFullName,
      orgLogin: contribution.orgLogin,
      title: contribution.title,
      description: contribution.desc ?? "",
      desc: contribution.desc ?? "",
      url: contribution.url,
      mergedAt: contribution.mergedAt,
      tag: contribution.tag,
      orgAvatar: contribution.orgAvatarUrl ?? "",
      orgAvatarUrl: contribution.orgAvatarUrl ?? "",
      orgUrl: contribution.orgHtmlUrl ?? "",
      orgHtmlUrl: contribution.orgHtmlUrl ?? "",
      userAvatarUrl: contribution.userAvatarUrl ?? "",
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  export async function getGlobalStats() {
    const stats = await Contribution.aggregate([
      {
        $group: {
          _id: null,
          totalMergedPRs: { $sum: 1 },
          contributors: { $addToSet: "$memberName" },
          orgs: { $addToSet: "$orgLogin" },
        },
      },
    ]);
  
    return {
      totalMergedPRs: stats[0]?.totalMergedPRs || 0,
      totalContributors: stats[0]?.contributors.length || 0,
      totalOrganizations: stats[0]?.orgs.length || 0,
    };
  }
  export async function retagAllContributions() {
    const contributions = await Contribution.find({}, {
      _id: 1,
      orgLogin: 1,
    }).lean();
  
    let updatedCount = 0;
  
    for (const doc of contributions) {
      const newTag = getOrgTagSync(doc.orgLogin); // 👈 your existing logic
  
      const res = await Contribution.updateOne(
        { _id: doc._id },
        { $set: { tag: newTag } }
      );
  
      if (res.modifiedCount > 0) updatedCount++;
    }
  
    return {
      total: contributions.length,
      updated: updatedCount,
    };
  }

  export async function backfillDescriptions() {
    await connectDB();
    const octokit = createOctokit();  
    const missing = await Contribution.find(
      { $or: [{ desc: { $exists: false } }, { desc: "" }, { desc: null }] },
      { _id: 1, url: 1, platform: 1 }
    ).lean();
  
    console.log(`[Backfill] Found ${missing.length} contributions without desc`);
  
  
    let updated = 0, failed = 0;
  
    for (const doc of missing) {
      try {
        let desc = "";
  
        if (doc.platform === "github") {
          // GitHub PR URL format: https://github.com/owner/repo/pull/123
          const match = doc.url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
          if (match) {
            const [, owner, repo, pull_number] = match;
            const { data } = await octokit.rest.pulls.get({
              owner, repo, pull_number: parseInt(pull_number),
            });
            desc = data.body ?? "";
          }
        } else if (doc.platform === "gitlab") {
          // GitLab MR URL format: https://gitlab.com/group/repo/-/merge_requests/123
          const match = doc.url.match(/gitlab\.com\/(.+)\/-\/merge_requests\/(\d+)/);
          if (match) {
            const [, projectPath, mrIid] = match;
            const encodedPath = encodeURIComponent(projectPath);
            const res = await fetch(
              `https://gitlab.com/api/v4/projects/${encodedPath}/merge_requests/${mrIid}`,
              { headers: gitlabHeaders() }
            );
            if (res.ok) {
              const mr = await res.json();
              desc = mr.description ?? "";
            }
          }
        }
  
        await Contribution.updateOne(
          { _id: doc._id },
          { $set: { desc } }
        );
        updated++;

        await new Promise(r => setTimeout(r, 100));
  
      } catch (err: any) {
        console.error(`[Backfill] Failed for ${doc.url}:`, err.message);
        failed++;
      }
    }
  
    return { total: missing.length, updated, failed };
  }

  export async function backfillOrgAndUserAvatars() {
    await connectDB();
    const octokit = createOctokit();
   
    // 1. Fill orgAvatarUrl / orgHtmlUrl from orgs_v2 — pure DB join, no API calls
    console.log("[Backfill/orgAvatar] Joining from orgs_v2...");
    const orgs = await Org.find({}, { login: 1, avatarUrl: 1, htmlUrl: 1, platform: 1 }).lean();
    const orgByKey = new Map(orgs.map((o) => [`${o.login.toLowerCase()}:${o.platform}`, o]));
   
    // Find contributions missing orgAvatarUrl grouped by orgLogin+platform
    const missingOrgAvatar = await Contribution.find(
      { $or: [{ orgAvatarUrl: { $exists: false } }, { orgAvatarUrl: "" }] },
      { _id: 1, orgLogin: 1, platform: 1 }
    ).lean();
   
    console.log(`[Backfill/orgAvatar] ${missingOrgAvatar.length} contributions missing orgAvatarUrl`);
   
    let orgAvatarUpdated = 0;
    for (const doc of missingOrgAvatar) {
      const key = `${doc.orgLogin.toLowerCase()}:${doc.platform}`;
      const org = orgByKey.get(key);
      if (!org) continue;
   
      const setFields: Record<string, any> = {};
      if (org.avatarUrl) setFields.orgAvatarUrl = org.avatarUrl;
      if (org.htmlUrl)   setFields.orgHtmlUrl   = org.htmlUrl;
      if (Object.keys(setFields).length === 0) continue;
   
      await Contribution.updateOne({ _id: doc._id }, { $set: setFields });
      orgAvatarUpdated++;
    }
    console.log(`[Backfill/orgAvatar] Updated ${orgAvatarUpdated} contributions`);
   
    // 2. Fill userAvatarUrl — needs API calls, GitHub only for now
    //    (GitLab avatar lives on the MR author object and isn't cheap to re-fetch)
    const missingUserAvatar = await Contribution.find(
      {
        platform: "github",
        $or: [{ userAvatarUrl: { $exists: false } }, { userAvatarUrl: "" }],
      },
      { _id: 1, username: 1 }
    ).lean();
   
    console.log(`[Backfill/userAvatar] ${missingUserAvatar.length} GitHub contributions missing userAvatarUrl`);
   
    // Deduplicate by username — one API call per user, then bulk-update
    const usernameToAvatar = new Map<string, string>();
    const uniqueUsernames = [...new Set(missingUserAvatar.map((d) => d.username))];
   
    let userAvatarFetched = 0, userAvatarFailed = 0;
    for (const username of uniqueUsernames) {
      if (usernameToAvatar.has(username)) continue;
      try {
        const { data } = await octokit.rest.users.getByUsername({ username });
        usernameToAvatar.set(username, data.avatar_url);
        userAvatarFetched++;
        await new Promise((r) => setTimeout(r, 80)); // ~12 req/s, well inside rate limit
      } catch (err: any) {
        console.warn(`[Backfill/userAvatar] Failed for ${username}: ${err.message}`);
        userAvatarFailed++;
      }
    }
   
    // Bulk-update all docs for each username
    let userAvatarUpdated = 0;
    for (const [username, avatarUrl] of usernameToAvatar) {
      const res = await Contribution.updateMany(
        {
          username,
          platform: "github",
          $or: [{ userAvatarUrl: { $exists: false } }, { userAvatarUrl: "" }],
        },
        { $set: { userAvatarUrl: avatarUrl } }
      );
      userAvatarUpdated += res.modifiedCount;
    }
   
    console.log(
      `[Backfill/userAvatar] fetched=${userAvatarFetched} failed=${userAvatarFailed} docsUpdated=${userAvatarUpdated}`
    );
   
    return {
      orgAvatar: { checked: missingOrgAvatar.length, updated: orgAvatarUpdated },
      userAvatar: {
        uniqueUsers: uniqueUsernames.length,
        fetched: userAvatarFetched,
        failed: userAvatarFailed,
        docsUpdated: userAvatarUpdated,
      },
    };
  }
