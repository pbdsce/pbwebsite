/* eslint-disable @typescript-eslint/no-explicit-any */
import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { retry } from "@octokit/plugin-retry";
import connectDB from "@/lib/db/connection";
import Contribution from "@/lib/db/models/contributions";
import Org from "@/lib/db/models/orgs";
import { getOrgTag } from "@/lib/data/orgs";

const OctokitWithPlugins = Octokit.plugin(throttling, retry);

const octokit = new OctokitWithPlugins({
  auth: process.env.TOKEN_GITHUB,
  throttle: {
    onRateLimit: (retryAfter: number, options: any, _: any, retryCount: number) => {
      console.warn(`[GitHub] Rate limit — retrying after ${retryAfter}s (attempt ${retryCount + 1}/3)`);
      return retryCount < 3;
    },
    onSecondaryRateLimit: (_: number, options: any) => {
      console.warn(`[GitHub] Secondary rate limit on ${options.url}`);
      return true;
    },
  },
});

const STAR_THRESHOLD = parseInt(process.env.GITHUB_STAR_THRESHOLD || "100", 10);

const GITHUB_USERNAMES = process.env.GITHUB_USERNAMES
  ? process.env.GITHUB_USERNAMES.split(",").map((u) => u.trim())
  : [];


interface RepoDetails {
  full_name: string;
  stargazers_count: number;
  private: boolean;
  fork: boolean;
  owner: {
    login: string;
    type: string;
    avatar_url: string;
  };
}

interface ContributionData {
  username: string;
  repoFullName: string;
  repoStars: number;
  orgLogin: string;
  orgAvatarUrl: string;
  type: "pr" | "commit";
  title: string;
  url: string;
  isMerged: boolean | null;
  mergedAt: string | null;
  committedAt: string | null;
}


const repoCache = new Map<string, RepoDetails | null>();

async function getRepoDetails(repoFullName: string): Promise<RepoDetails | null> {
  if (repoCache.has(repoFullName)) return repoCache.get(repoFullName)!;

  try {
    const [owner, repo] = repoFullName.split("/");
    const { data } = await octokit.rest.repos.get({ owner, repo });
    repoCache.set(repoFullName, data as RepoDetails);
    return data as RepoDetails;
  } catch (err: any) {
    if (err.status === 404) {
      repoCache.set(repoFullName, null);
      return null;
    }
    throw err;
  }
}


function isQualityRepo(repo: RepoDetails, authorUsername: string): boolean {
  if (repo.owner.type !== "Organization") return false;
  if (repo.private) return false;
  if (repo.stargazers_count < STAR_THRESHOLD) return false;
  if (repo.owner.login.toLowerCase() === authorUsername.toLowerCase()) return false;
  return true;
}

async function fetchMergedPRs(username: string): Promise<ContributionData[]> {
  console.log(`[Scraper] Fetching merged PRs for: ${username}`);
  const results: ContributionData[] = [];
  const seenUrls = new Set<string>();

  // Split into yearly windows from 2015 to current year to avoid the 1k cap
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2017 }, (_, i) => 2018 + i);

  for (const year of years) {
    const from = `${year}-01-01`;
    const to   = `${year}-12-31`;

    const iterator = octokit.paginate.iterator(
      octokit.rest.search.issuesAndPullRequests,
      {
        q: `author:${username} type:pr is:merged is:public merged:${from}..${to}`,
        sort: "created",
        order: "desc",
        per_page: 100,
      }
    );

    for await (const page of iterator) {
      for (const pr of page.data) {
        if (seenUrls.has(pr.html_url)) continue;
        seenUrls.add(pr.html_url);

        const repoFullName = pr.repository_url.replace("https://api.github.com/repos/", "");
        const repo = await getRepoDetails(repoFullName);
        if (!repo || !isQualityRepo(repo, username)) continue;
        const mergedAt = pr.pull_request?.merged_at ?? null;

        results.push({
          username,
          repoFullName,
          repoStars: repo.stargazers_count,
          orgLogin: repo.owner.login,
          orgAvatarUrl: repo.owner.avatar_url,
          type: "pr",
          title: pr.title,
          url: pr.html_url,
          isMerged: mergedAt !== null,
          mergedAt,
          committedAt: null,
        });
      }
    }
  }

  console.log(`[Scraper] ${username} → ${results.length} merged PRs`);
  return results;
}

const orgRepoCache = new Map<string, RepoDetails[]>();

async function getQualifyingOrgRepos(orgLogin: string): Promise<RepoDetails[]> {
  if (orgRepoCache.has(orgLogin)) return orgRepoCache.get(orgLogin)!;

  const repos: RepoDetails[] = [];

  const iterator = octokit.paginate.iterator(octokit.rest.repos.listForOrg, {
    org: orgLogin,
    type: "public",
    per_page: 100,
  });

  for await (const page of iterator) {
    for (const repo of page.data) {
        if ((repo.stargazers_count ?? 0) >= STAR_THRESHOLD) {
        const details = repo as unknown as RepoDetails;
        repoCache.set(repo.full_name, details);
        repos.push(details);
      }
    }
  }

  orgRepoCache.set(orgLogin, repos);
  return repos;
}

async function fetchCommits(
  username: string,
  orgLoginsFromPRs: string[]
): Promise<ContributionData[]> {
  console.log(`[Scraper] Fetching commits for: ${username}`);
  const results: ContributionData[] = [];
  const seenUrls = new Set<string>();

  // Also include orgs already stored in DB from previous runs
  const dbOrgs = await Contribution.distinct("orgLogin", { username });
  const orgLogins = [...new Set([...orgLoginsFromPRs, ...dbOrgs])] as string[];

  for (const orgLogin of orgLogins) {
    const repos = await getQualifyingOrgRepos(orgLogin);

    for (const repo of repos) {
      try {
        const iterator = octokit.paginate.iterator(octokit.rest.repos.listCommits, {
          owner: repo.owner.login,
          repo:  repo.full_name.split("/")[1],
          author: username,
          per_page: 100,
        });

        for await (const page of iterator) {
          for (const commit of page.data) {
            const url = commit.html_url;
            if (seenUrls.has(url)) continue;
            seenUrls.add(url);

            results.push({
              username,
              repoFullName:  repo.full_name,
              repoStars:     repo.stargazers_count,
              orgLogin:      repo.owner.login,
              orgAvatarUrl:  repo.owner.avatar_url,
              type:          "commit",
              title:         commit.commit.message.split("\n")[0],
              url,
              isMerged:      null,
              mergedAt:      null,
              committedAt:   commit.commit.committer?.date ?? null,
            });
          }
        }
      } catch (err: any) {
        if (err.status === 404 || err.status === 409) continue;
        throw err;
      }
    }
  }

  console.log(`[Scraper] ${username} → ${results.length} commits`);
  return results;
}

// ─── Save to DB ───────────────────────────────────────────────────────────────

async function saveToDB(contributions: ContributionData[]): Promise<void> {
  const orgsMap = new Map<string, { login: string; avatarUrl: string; htmlUrl: string }>();
  for (const c of contributions) {
    if (!orgsMap.has(c.orgLogin)) {
      orgsMap.set(c.orgLogin, {
        login:    c.orgLogin,
        avatarUrl: c.orgAvatarUrl,
        htmlUrl:  `https://github.com/${c.orgLogin}`,
      });
    }
  }

  for (const org of orgsMap.values()) {
    await Org.findOneAndUpdate(
      { login: org.login },
      { ...org, lastFetched: new Date() },
      { upsert: true, returnDocument: "after" }
    );
  }

  for (const c of contributions) {
    await Contribution.findOneAndUpdate(
      { username: c.username, url: c.url },
      {
        username:     c.username,
        repoFullName: c.repoFullName,
        repoStars:    c.repoStars,
        orgLogin:     c.orgLogin,
        type:         c.type,
        title:        c.title,
        url:          c.url,
        isMerged:     c.isMerged,
        mergedAt:     c.mergedAt,
        committedAt:  c.committedAt,
        scrapedAt:    new Date(),
      },
      { upsert: true, returnDocument: "after" }
    );
  }

  console.log(`[DB] Saved ${contributions.length} records across ${orgsMap.size} orgs`);
}

export async function runScrapeJob(): Promise<{ totalPRs: number; totalCommits: number; users: number }> {
  await connectDB();

  if (GITHUB_USERNAMES.length === 0) {
    throw new Error("GITHUB_USERNAMES is not set in environment variables");
  }

  repoCache.clear();
  orgRepoCache.clear();

  console.log(`[Job] Scraping ${GITHUB_USERNAMES.length} users: ${GITHUB_USERNAMES.join(", ")}`);

  let totalPRs = 0;
  let totalCommits = 0;

  for (const username of GITHUB_USERNAMES) {
    try {
 
      const prs = await fetchMergedPRs(username);
      const orgLoginsFromPRs = [...new Set(prs.map((p) => p.orgLogin))];

      const commits = await fetchCommits(username, orgLoginsFromPRs);

      const all = [...prs, ...commits];
      if (all.length > 0) await saveToDB(all);

      totalPRs     += prs.length;
      totalCommits += commits.length;
    } catch (err: any) {
      console.error(`[Job] Failed for ${username}:`, err.message);
    }
  }

  console.log(`[Job] Done — PRs: ${totalPRs}, Commits: ${totalCommits}`);
  return { totalPRs, totalCommits, users: GITHUB_USERNAMES.length };
}


export async function getOrgBreakdown() {
  await connectDB();

  const orgs = await Contribution.aggregate([
    {
      $group: {
        _id: { orgLogin: "$orgLogin", type: "$type" },
        count: { $sum: 1 },
        contributors: { $addToSet: "$username" },
      },
    },
    {
      $group: {
        _id: "$_id.orgLogin",
        totalMergedPRs: {
          $sum: { $cond: [{ $eq: ["$_id.type", "pr"] }, "$count", 0] },
        },
        totalCommits: {
          $sum: { $cond: [{ $eq: ["$_id.type", "commit"] }, "$count", 0] },
        },
        allContributors: { $push: "$contributors" },
      },
    },
    {
      $lookup: {
        from: "orgs",
        localField: "_id",
        foreignField: "login",
        as: "orgDetails",
      },
    },
    { $unwind: "$orgDetails" },
    {
      $project: {
        _id: 0,
        orgLogin: "$_id",
        orgAvatar: "$orgDetails.avatarUrl",
        orgUrl: "$orgDetails.htmlUrl",
        totalMergedPRs: 1,
        totalCommits: 1,
        contributors: {
            $ifNull: [
              {
                $reduce: {
                  input: "$allContributors",
                  initialValue: [],
                  in: { $setUnion: ["$$value", "$$this"] },
                },
              },
              [],
            ],
          },
      },
    },
    {
        $addFields: {
          totalContributions: "$totalMergedPRs",
          contributorCount: {
            $size: {
              $ifNull: [
                {
                  $reduce: {
                    input: "$allContributors",
                    initialValue: [],
                    in: { $setUnion: ["$$value", "$$this"] },
                  },
                },
                [],
              ],
            },
          },
        },
      },
    { $sort: { totalContributions: -1 } },
  ]);

  return orgs.map((org: any) => ({
    ...org,
    tag: getOrgTag(org.orgLogin),
  }));
}

export async function getGlobalStats() {
  await connectDB();

  const [result] = await Contribution.aggregate([
    {
      $group: {
        _id: null,
        totalMergedPRs:     { $sum: { $cond: [{ $eq: ["$type", "pr"] }, 1, 0] } },
        totalCommits:       { $sum: { $cond: [{ $eq: ["$type", "commit"] }, 1, 0] } },
        uniqueOrgs:         { $addToSet: "$orgLogin" },
        uniqueContributors: { $addToSet: "$username" },
      },
    },
    {
      $project: {
        _id: 0,
        totalMergedPRs: 1,
        totalCommits: 1,
        totalContributions: "$totalMergedPRs",
        totalOrgs:          { $size: "$uniqueOrgs" },
        totalContributors:  { $size: "$uniqueContributors" },
      },
    },
  ]);

  return result ?? {
    totalMergedPRs: 0,
    totalCommits: 0,
    totalContributions: 0,
    totalOrgs: 0,
    totalContributors: 0,
  };
}

export async function getContributorStats(username?: string) {
  await connectDB();

  const matchStage: Record<string, any> = {};
  if (username) matchStage.username = username;

  return Contribution.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: { username: "$username", type: "$type" },
        count: { $sum: 1 },
        orgs: { $addToSet: "$orgLogin" },
      },
    },
    {
      $group: {
        _id: "$_id.username",
        totalMergedPRs: {
          $sum: { $cond: [{ $eq: ["$_id.type", "pr"] }, "$count", 0] },
        },
        totalCommits: {
          $sum: { $cond: [{ $eq: ["$_id.type", "commit"] }, "$count", 0] },
        },
        allOrgs: { $push: "$orgs" },
      },
    },
    {
      $project: {
        _id: 0,
        username: "$_id",
        totalMergedPRs: 1,
        totalCommits: 1,
        totalContributions: "$totalMergedPRs",
        orgs: {
          $reduce: {
            input: "$allOrgs",
            initialValue: [],
            in: { $setUnion: ["$$value", "$$this"] },
          },
        },
      },
    },
    {
      $addFields: {
        totalOrgs: { $size: "$orgs" },
      },
    },
    { $sort: { totalContributions: -1 } },
  ]);
}