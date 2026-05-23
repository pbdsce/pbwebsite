export const GITLAB_ORIGIN = "https://gitlab.com";

export const POINT_BLANK_ORG_PATTERNS = [
  /^point[-_\s]?blank$/i,
  /^point[-_\s]?blank[-_\s]?club$/i,
];

export const POINT_BLANK_ORG_EXCLUSION = {
  $nor: POINT_BLANK_ORG_PATTERNS.map((pattern) => ({ orgLogin: pattern })),
};

export function normalizeExternalUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${GITLAB_ORIGIN}${url}`;
  if (url.startsWith("uploads/")) return `${GITLAB_ORIGIN}/${url}`;
  return url;
}

export function isPointBlankOrg(orgLogin?: string | null): boolean {
  if (!orgLogin) return false;
  return POINT_BLANK_ORG_PATTERNS.some((pattern) => pattern.test(orgLogin));
}

export function nonEmptyStrings(values: unknown[]): string[] {
  return values.filter(
    (value): value is string => typeof value === "string" && value.trim().length > 0,
  );
}
