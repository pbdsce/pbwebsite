/* eslint-disable @typescript-eslint/no-explicit-any */
import { getOrgTagSync } from "@/lib/data/orgs";
import type { RawContribution } from "./types";

const GITLAB_BASE  = "https://gitlab.com/api/v4";
const GITLAB_TOKEN = process.env.TOKEN_GITLAB;

function gitlabHeaders(): HeadersInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (GITLAB_TOKEN) headers["PRIVATE-TOKEN"] = GITLAB_TOKEN;
  return headers;
}

async function gitlabPaginate<T>(path: string, params: Record<string, string> = {}): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  while (true) {
    const url = new URL(`${GITLAB_BASE}${path}`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("page", String(page));
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString(), { headers: gitlabHeaders() });
    if (!res.ok) break;

    const data: T[] = await res.json();
    if (data.length === 0) break;
    results.push(...data);

    const nextPage = res.headers.get("x-next-page");
    if (!nextPage || nextPage === "") break;
    page = parseInt(nextPage, 10);
  }
  return results;
}

interface GitLabUser     { id: number; username: string; }
interface GitLabProject  {
  id: number;
  path_with_namespace: string;
  namespace: { kind: "group" | "user"; path: string; avatar_url: string | null; web_url: string; };
  star_count: number;
  visibility: string;
  forked_from_project?: { id: number };
}
interface GitLabMR {
  title: string; web_url: string; merged_at: string | null;
  author: { id: number; username: string };
}

export async function resolveGitLabUserId(username: string): Promise<number | null> {
  try {
    const url = new URL(`${GITLAB_BASE}/users`);
    url.searchParams.set("username", username);
    const res = await fetch(url.toString(), { headers: gitlabHeaders() });
    if (!res.ok) return null;
    const users: GitLabUser[] = await res.json();
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase())?.id ?? null;
  } catch { return null; }
}

function isValidGitLabRepo(project: GitLabProject, username: string, customOrgLinks: string[]): boolean {
  if (project.visibility !== "public")   return false;
  if (project.forked_from_project)       return false;
  if (project.namespace.kind === "user") return false;
  if (project.namespace.path.toLowerCase() === username.toLowerCase()) return false;

  const groupLogin = project.namespace.path;

  if (customOrgLinks.some((l) =>
    l.toLowerCase().includes(groupLogin.toLowerCase()) ||
    l.toLowerCase().includes("gitlab.com/" + groupLogin.toLowerCase())
  )) return true;

  if (getOrgTagSync(groupLogin) !== "none") return true;
  if (project.namespace.kind === "group" && project.star_count >= 50) return true;
  if (project.star_count >= 200) return true;

  return false;
}

export interface GitLabFetchOptions {
  username:       string;
  memberName:     string;
  gitlabUserId:   number;
  customOrgLinks: string[];
  since?:         Date;
}

export async function fetchGitLabMergedMRs(options: GitLabFetchOptions): Promise<RawContribution[]> {
  const { username, memberName, gitlabUserId, customOrgLinks, since } = options;
  console.log(`[GitLab] Fetching MRs for ${username} (id: ${gitlabUserId})`);

  const results: RawContribution[] = [];
  const seenUrls = new Set<string>();

  let contributedProjects: GitLabProject[] = [];
  try {
    contributedProjects = await gitlabPaginate<GitLabProject>(
      `/users/${gitlabUserId}/contributed_projects`,
      { order_by: "last_activity_at", sort: "desc" }
    );
  } catch (err: any) {
    console.warn(`[GitLab] Could not fetch projects for ${username}: ${err.message}`);
    return [];
  }

  for (const project of contributedProjects) {
    if (!isValidGitLabRepo(project, username, customOrgLinks)) continue;

    const params: Record<string, string> = {
      author_id: String(gitlabUserId), state: "merged", scope: "all",
    };
    if (since) params.updated_after = since.toISOString();

    try {
      const mrs = await gitlabPaginate<GitLabMR>(`/projects/${project.id}/merge_requests`, params);

      for (const mr of mrs) {
        if (seenUrls.has(mr.web_url)) continue;
        seenUrls.add(mr.web_url);
        if (!mr.merged_at) continue;

        const mergedDate = new Date(mr.merged_at);
        if (since && mergedDate < since)         continue;
        if (mergedDate.getFullYear() < 2019)     continue;

        results.push({
          memberName, username, platform: "gitlab",
          repoFullName: project.path_with_namespace,
          orgLogin:     project.namespace.path,
          orgAvatarUrl: project.namespace.avatar_url ?? "",
          orgHtmlUrl:   project.namespace.web_url,
          title:        mr.title,
          url:          mr.web_url,
          mergedAt:     mergedDate,
        });
      }
    } catch (err: any) {
      if (err.status === 404 || err.status === 403) continue;
      console.warn(`[GitLab] Error on ${project.path_with_namespace}: ${err.message}`);
    }
  }

  console.log(`[GitLab] ${username} → ${results.length} valid MRs`);
  return results;
}