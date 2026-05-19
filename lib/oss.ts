export type ContributionTag = "gsoc" | "lfx" | "both" | "none";

export interface OssStats {
  totalMergedPRs: number;
  totalCommits: number;
  totalContributions: number;
  totalOrganizations: number;
  totalContributors: number;
}

export interface OssOrganization {
  id: string;
  name: string;
  url?: string;
  description?: string;
  avatarUrl?: string;
  descriptions?: string[];
  prCount: number;
  commitCount: number;
  totalContributions: number;
  contributorCount: number;
  contributorIds: string[];
  tag: ContributionTag;
}

export interface OssContributor {
  id: string;
  name: string;
  login?: string;
  handle?: string;
  url?: string;
  bio?: string;
  avatarUrl?: string;
  descriptions?: string[];
  prCount: number;
  commitCount: number;
  totalContributions: number;
  organizationIds: string[];
  totalOrganizations: number;
}

export type NormalizedOssOrganization = OssOrganization;

export type NormalizedOssContributor = OssContributor;

export interface NormalizedOssData {
  lastUpdated?: string;
  stats: OssStats;
  organizations: NormalizedOssOrganization[];
  contributors: NormalizedOssContributor[];
  pullRequests: Array<never>;
}

export interface ContributionsStatsResponse {
  totalMergedPRs: number;
  totalCommits: number;
  totalContributions: number;
  totalOrgs: number;
  totalContributors: number;
}

export interface ContributionsOrganizationRow {
  orgLogin: string;
  orgAvatar?: string;
  orgUrl?: string;
  description?: string;
  descriptions?: string[];
  totalMergedPRs: number;
  totalCommits: number;
  totalContributions: number;
  contributorCount: number;
  contributors: string[];
  tag: ContributionTag;
}

export interface ContributionsContributorRow {
  username: string;
  userAvatarUrl?: string;
  description?: string;
  descriptions?: string[];
  totalMergedPRs: number;
  totalCommits: number;
  totalContributions: number;
  orgs: string[];
  totalOrgs: number;
}

export interface ContributionsCollectionResponse<T> {
  data: T[];
}

export interface ContributionsSnapshot {
  lastUpdated?: string;
  stats?: Partial<ContributionsStatsResponse> | null;
  organizations?: ContributionsOrganizationRow[] | null;
  contributors?: ContributionsContributorRow[] | null;
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toId(parts: Array<string | undefined>, fallback: string) {
  const joined = parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join("-");

  return slugify(joined) || fallback;
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function createEmptyOssResponse(): NormalizedOssData {
  return {
    lastUpdated: new Date().toISOString(),
    stats: {
      totalMergedPRs: 0,
      totalCommits: 0,
      totalContributions: 0,
      totalOrganizations: 0,
      totalContributors: 0,
    },
    organizations: [],
    contributors: [],
    pullRequests: [],
  };
}

export function normalizeContributionsData(
  payload?: ContributionsSnapshot | null,
): NormalizedOssData {
  const response = payload ?? {};
  const contributorMap = new Map<string, NormalizedOssContributor>();
  const organizationMap = new Map<string, NormalizedOssOrganization>();
  const orgNamesById = new Map<string, string>();

  for (const [index, contributor] of (response.contributors ?? []).entries()) {
    const username = contributor.username?.trim() || `contributor-${index + 1}`;
    const id = toId([username], `contributor-${index + 1}`);
    const organizationIds = uniqueValues(
      (contributor.orgs ?? []).map((organization) =>
        toId([organization], `contributor-org-${index + 1}`),
      ),
    );

    contributorMap.set(id, {
      id,
      name: username,
      login: username,
      bio: contributor.description,
      avatarUrl: contributor.userAvatarUrl,
      descriptions: contributor.descriptions ?? [],
      prCount: contributor.totalMergedPRs ?? 0,
      commitCount: contributor.totalCommits ?? 0,
      totalContributions: contributor.totalContributions ?? 0,
      organizationIds,
      totalOrganizations: contributor.totalOrgs ?? organizationIds.length,
    });

    for (const organization of contributor.orgs ?? []) {
      const organizationId = toId([organization], `contributor-org-${index + 1}`);
      orgNamesById.set(organizationId, organization);
    }
  }

  for (const [index, organization] of (response.organizations ?? []).entries()) {
    const orgLogin = organization.orgLogin?.trim() || `organization-${index + 1}`;
    const id = toId([orgLogin], `organization-${index + 1}`);
    const contributorIds = uniqueValues(
      (organization.contributors ?? []).map((contributor) =>
        toId([contributor], `organization-contributor-${index + 1}`),
      ),
    );

    organizationMap.set(id, {
      id,
      name: orgLogin,
      url: organization.orgUrl?.trim(),
      description: organization.description,
      avatarUrl: organization.orgAvatar,
      descriptions: organization.descriptions ?? [],
      prCount: organization.totalMergedPRs ?? 0,
      commitCount: organization.totalCommits ?? 0,
      totalContributions: organization.totalContributions ?? 0,
      contributorCount: organization.contributorCount ?? contributorIds.length,
      contributorIds,
      tag: organization.tag ?? "none",
    });

    orgNamesById.set(id, orgLogin);

    for (const contributor of organization.contributors ?? []) {
      const contributorId = toId([contributor], `organization-contributor-${index + 1}`);
      const existingContributor = contributorMap.get(contributorId);

      if (existingContributor) {
        if (!existingContributor.organizationIds.includes(id)) {
          existingContributor.organizationIds.push(id);
          existingContributor.totalOrganizations = existingContributor.organizationIds.length;
        }
        continue;
      }

      contributorMap.set(contributorId, {
        id: contributorId,
        name: contributor,
        login: contributor,
        prCount: 0,
        commitCount: 0,
        totalContributions: 0,
        organizationIds: [id],
        totalOrganizations: 1,
      });
    }
  }

  for (const contributor of contributorMap.values()) {
    for (const organizationId of contributor.organizationIds) {
      if (!organizationMap.has(organizationId)) {
        organizationMap.set(organizationId, {
          id: organizationId,
          name: orgNamesById.get(organizationId) ?? organizationId,
          prCount: 0,
          commitCount: 0,
          totalContributions: 0,
          contributorCount: 0,
          contributorIds: [],
          tag: "none",
        });
      }

      const organization = organizationMap.get(organizationId);
      if (organization && !organization.contributorIds.includes(contributor.id)) {
        organization.contributorIds.push(contributor.id);
      }
    }
  }

  for (const organization of organizationMap.values()) {
    organization.contributorIds = uniqueValues(organization.contributorIds);
    organization.contributorCount = organization.contributorIds.length;
  }

  for (const contributor of contributorMap.values()) {
    contributor.organizationIds = uniqueValues(contributor.organizationIds);
    contributor.totalOrganizations = contributor.organizationIds.length;
  }

  const organizations = Array.from(organizationMap.values()).sort((left, right) => {
    return (
      right.totalContributions - left.totalContributions ||
      right.prCount - left.prCount ||
      left.name.localeCompare(right.name)
    );
  });

  const contributors = Array.from(contributorMap.values()).sort((left, right) => {
    return (
      right.totalContributions - left.totalContributions ||
      right.prCount - left.prCount ||
      left.name.localeCompare(right.name)
    );
  });

  const statsFromOrganizations = organizations.reduce(
    (accumulator, organization) => {
      accumulator.totalMergedPRs += organization.prCount;
      accumulator.totalCommits += organization.commitCount;
      accumulator.totalContributions += organization.totalContributions;
      return accumulator;
    },
    {
      totalMergedPRs: 0,
      totalCommits: 0,
      totalContributions: 0,
    },
  );

  return {
    lastUpdated: response.lastUpdated,
    stats: {
      totalMergedPRs:
        response.stats?.totalMergedPRs ?? statsFromOrganizations.totalMergedPRs,
      totalCommits: response.stats?.totalCommits ?? statsFromOrganizations.totalCommits,
      totalContributions:
        response.stats?.totalContributions ?? statsFromOrganizations.totalContributions,
      totalOrganizations: response.stats?.totalOrgs ?? organizations.length,
      totalContributors: response.stats?.totalContributors ?? contributors.length,
    },
    organizations,
    contributors,
    pullRequests: [],
  };
}
