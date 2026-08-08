import { ExternalLink } from "lucide-react";
import type { OrganizationView } from "@/components/oss/types";
import OssFlipAvatar from "@/components/oss/widgets/OssFlipAvatar";
import { getOrganizationGithubUrl } from "@/components/oss/utils";

export default function OssOrganizationPreviewCard({
  organization,
  flipped,
  onToggleFlip,
}: {
  organization: OrganizationView;
  flipped: boolean;
  onToggleFlip: () => void;
}) {
  const organizationUrl = getOrganizationGithubUrl(
    organization.name,
    organization.url,
  );
  const contributorCount = organization.contributors.length;

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-[20px] border bg-pbgray p-3 transition-colors duration-200 sm:gap-5 sm:p-4 ${
        flipped
          ? "border-pbgreen"
          : "border-transparent hover:border-pbgreen/60"
      }`}
    >
      <OssFlipAvatar
        login={organization.name}
        name={organization.name}
        platform={organization.platform}
        avatarUrl={organization.avatarUrl}
        size={96}
        href={organizationUrl}
        linkLabel={`Open ${organization.name} on GitHub`}
        icon={<ExternalLink className="h-6 w-6 text-pbgreen" />}
        flipped={flipped}
        onToggle={onToggleFlip}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-white sm:text-lg">
          {organization.name}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-400 sm:text-sm">
          {organization.description || organizationUrl || " "}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-xs font-semibold text-pbgreen sm:text-sm">
            {organization.prCount} PRs
          </span>
          <span className="text-xs text-zinc-500 sm:text-sm">
            {contributorCount} {contributorCount === 1 ? "contributor" : "contributors"}
          </span>
        </div>
      </div>
    </div>
  );
}
