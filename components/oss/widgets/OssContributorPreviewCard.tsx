import type { ContributorView } from "@/components/oss/types";
import OssFlipAvatar from "@/components/oss/widgets/OssFlipAvatar";
import { GithubMarkIcon } from "@/components/oss/elements/OssIcons";
import { getContributorGithubUrl } from "@/components/oss/utils";

export default function OssContributorPreviewCard({
  contributor,
  flipped,
  onToggleFlip,
}: {
  contributor: ContributorView;
  flipped: boolean;
  onToggleFlip: () => void;
}) {
  const contributorUrl = getContributorGithubUrl(contributor);
  const orgCount = contributor.organizations.length;

  return (
    <div
      className={`flex w-full items-center gap-4 rounded-[20px] border bg-pbgray p-3 transition-colors duration-200 sm:gap-5 sm:p-4 ${
        flipped
          ? "border-pbgreen"
          : "border-transparent hover:border-pbgreen/60"
      }`}
    >
      <OssFlipAvatar
        login={contributor.login}
        name={contributor.name}
        platform={contributor.platform}
        size={96}
        href={contributorUrl}
        linkLabel={`Open ${contributor.name}'s GitHub profile`}
        icon={<GithubMarkIcon className="h-8 w-8" />}
        flipped={flipped}
        onToggle={onToggleFlip}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-white sm:text-lg">
          {contributor.name}
        </p>
        <p className="mt-1 truncate text-xs text-zinc-400 sm:text-sm">
          {contributor.login
            ? `@${contributor.login}`
            : "Point Blank contributor"}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <span className="text-xs font-semibold text-pbgreen sm:text-sm">
            {contributor.prCount} PRs
          </span>
          <span className="text-xs text-zinc-500 sm:text-sm">
            {orgCount} {orgCount === 1 ? "ORG" : "ORGs"}
          </span>
        </div>
      </div>
    </div>
  );
}
