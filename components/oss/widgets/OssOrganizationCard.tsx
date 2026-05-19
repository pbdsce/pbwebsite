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

export default function OssOrganizationCard({
  organization,
}: {
  organization: OrganizationView;
}) {
  const organizationUrl = getOrganizationGithubUrl(
    organization.name,
    organization.url,
  );

  return (
    <div className="flex flex-col rounded-[16px] bg-[#1c1c1c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:rounded-[20px] sm:p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6">
        <div className="flex min-w-0 items-start gap-3">
          {organization.avatarUrl && (
            <span
              aria-hidden="true"
              className="size-10 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${organization.avatarUrl})` }}
            />
          )}
          <div className="min-w-0">
            <h3 className="break-words text-lg font-medium text-white sm:text-xl">
              {organization.name}
            </h3>
          {organization.url && (
            <a
              href={organizationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block break-all pr-1 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {organization.url}
            </a>
          )}
          </div>
        </div>
        {SHOW_ORGANIZATION_TAGS && (
          <div className="flex flex-wrap items-center gap-2">
            <Pill
              className="font-medium uppercase tracking-[0.18em]"
              size="compact"
              variant="accent"
            >
              {formatTagLabel(organization.tag)}
            </Pill>
          </div>
        )}
      </div>

      {organization.description && (
        <p className="mb-5 text-sm leading-relaxed text-zinc-400">
          {organization.description}
        </p>
      )}

      <p className="mb-5 text-sm leading-relaxed text-zinc-400">
        {formatContributionMeta(
          organization.prCount,
        )}
      </p>

      <div className="mt-auto border-t border-zinc-800/50 pt-4">
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
          Active Contributors ({organization.contributors.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {organization.contributors.length === 0 ? (
            <span className="text-xs text-zinc-600">No active contributors</span>
          ) : (
            organization.contributors.map((contributor) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
