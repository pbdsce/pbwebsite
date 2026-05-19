import type { ContributorView } from "@/components/oss/types";
import { Pill } from "@/components/ui/Pill";
import {
  formatContributionMeta,
  getContributorGithubUrl,
  getOrganizationGithubUrl,
} from "@/components/oss/utils";

export default function OssContributorPreviewCard({
  contributor,
}: {
  contributor: ContributorView;
}) {
  const contributorUrl = getContributorGithubUrl(contributor);
  const shouldHideAdeiOrg =
    (contributor.login?.toLowerCase() === "saniyafatima07"
      || contributor.name.trim().toLowerCase() === "saniya fatima");
  const sortedOrganizations = contributor.organizations
    .filter(
      (organization) =>
        !(
          shouldHideAdeiOrg
          && organization.name.trim().toLowerCase() === "adeyosemanputra"
        ),
    )
    .sort(
      (left, right) =>
        (right.prCount ?? 0) - (left.prCount ?? 0) ||
        left.name.localeCompare(right.name),
    );
  const visibleOrganizations = sortedOrganizations.slice(0, 5);
  const remainingOrganizations = sortedOrganizations.slice(5);
  const remainingCount = remainingOrganizations.length;

  return (
    <div className="w-full rounded-[16px] bg-[#1c1c1c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:rounded-[20px] sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3 text-left">
          {contributor.avatarUrl && (
            <span
              aria-hidden="true"
              className="size-9 shrink-0 rounded-full bg-cover bg-center"
              style={{ backgroundImage: `url(${contributor.avatarUrl})` }}
            />
          )}
          <div className="min-w-0">
            <span className="block break-words font-medium text-base leading-tight text-white sm:text-lg">
              {contributor.name}
            </span>
          {contributorUrl ? (
            <a
              href={contributorUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-300 sm:text-sm"
            >
              {contributor.login
                ? `@${contributor.login}`
                : "Point Blank contributor"}
            </a>
          ) : (
            <span className="mt-1 block break-words text-xs font-medium text-zinc-500 sm:text-sm">
              {contributor.login
                ? `@${contributor.login}`
                : "Point Blank contributor"}
            </span>
          )}
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:mt-3 sm:text-sm">
            {formatContributionMeta(
              contributor.prCount,
            )}
          </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {sortedOrganizations.length === 0 ? (
            <Pill
              className="font-medium uppercase tracking-[0.14em]"
              size="compact"
              variant="muted"
            >
              No Orgs Yet
            </Pill>
          ) : (
            <>
              {visibleOrganizations.map((organization) => (
                <a
                  key={organization.id}
                  href={getOrganizationGithubUrl(
                    organization.name,
                    organization.url,
                    organization.platform,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                >
                  <Pill
                    className="max-w-[140px]"
                    variant="muted"
                  >
                    <span className="truncate">{organization.name}</span>
                  </Pill>
                </a>
              ))}
              {remainingCount > 0 && (
                <div className="group relative inline-block">
                  <Pill
                    className="cursor-pointer font-medium uppercase tracking-[0.14em]"
                    size="compact"
                    variant="muted"
                  >
                    +{remainingCount} More
                  </Pill>
                  <div className="invisible absolute left-1/2 top-full z-50 mt-2 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap gap-1.5 rounded-lg bg-[#111] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 sm:max-w-[320px]">
                    {remainingOrganizations.map((organization) => (
                      <a
                        key={organization.id}
                        href={getOrganizationGithubUrl(
                          organization.name,
                          organization.url,
                          organization.platform,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-transform hover:-translate-y-0.5"
                      >
                        <Pill size="compact" variant="muted">
                          {organization.name}
                        </Pill>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
