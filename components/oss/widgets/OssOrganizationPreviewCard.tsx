import type { OrganizationView } from "@/components/oss/types";
import { Pill } from "@/components/ui/Pill";
import {
  contributorLabel,
  formatContributionMeta,
  formatTagLabel,
  getContributorGithubUrl,
  getOrganizationGithubUrl,
  SHOW_ORGANIZATION_TAGS,
} from "@/components/oss/utils";

export default function OssOrganizationPreviewCard({
  organization,
}: {
  organization: OrganizationView;
}) {
  const organizationUrl = getOrganizationGithubUrl(
    organization.name,
    organization.url,
  );
  const visibleContributors = organization.contributors.slice(0, 2);
  const remainingContributors = organization.contributors.slice(2);

  return (
    <div className="flex h-[220px] w-full flex-col rounded-[16px] bg-[#1c1c1c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:rounded-[20px] sm:p-5">
      <div className="flex h-full flex-col gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#2a2a2a] bg-cover bg-center text-xs font-medium uppercase text-zinc-400"
            style={
              organization.avatarUrl
                ? { backgroundImage: `url(${organization.avatarUrl})` }
                : undefined
            }
          >
            {!organization.avatarUrl && organization.name.charAt(0)}
          </span>
          <div className="min-w-0">
            <span className="block break-words font-medium text-base text-white sm:text-lg">
              {organization.name}
            </span>
          {organization.url && (
            <a
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-all pr-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {organization.url}
            </a>
          )}
          <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:mt-3 sm:text-sm">
            {formatContributionMeta(
              organization.prCount,
            )}
          </p>
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          {SHOW_ORGANIZATION_TAGS && (
            <Pill
              className="font-medium uppercase tracking-[0.18em]"
              size="compact"
              variant="accent"
            >
              {formatTagLabel(organization.tag)}
            </Pill>
          )}
          {organization.contributors.length === 0 ? (
            <Pill
              className="font-medium uppercase tracking-[0.14em]"
              size="compact"
              variant="muted"
            >
              No Contributors
            </Pill>
          ) : (
            <>
              {visibleContributors.map((contributor) => (
                <a
                  key={contributor.id}
                  href={getContributorGithubUrl(contributor)}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-transform hover:-translate-y-0.5"
                >
                  <Pill variant="muted">
                    {contributorLabel(contributor)}
                  </Pill>
                </a>
              ))}
              {remainingContributors.length > 0 && (
                <div className="group relative inline-block">
                  <Pill
                    className="cursor-pointer font-medium uppercase tracking-[0.14em]"
                    size="compact"
                    variant="muted"
                  >
                    +{remainingContributors.length} More
                  </Pill>
                  <div className="invisible absolute left-1/2 top-full z-50 mt-2 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap gap-1.5 rounded-lg bg-[#111] p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 sm:max-w-[320px]">
                    {remainingContributors.map((contributor) => (
                      <a
                        key={contributor.id}
                        href={getContributorGithubUrl(contributor)}
                        target="_blank"
                        rel="noreferrer"
                        className="transition-transform hover:-translate-y-0.5"
                      >
                        <Pill size="compact" variant="muted">
                          {contributorLabel(contributor)}
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
