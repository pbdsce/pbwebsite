import {
  ContributorStatIcon,
  OrgStatIcon,
  PrStatIcon,
} from "@/components/oss/elements/OssIcons";
import OssStatCard from "@/components/oss/widgets/OssStatCard";

export default function OssOverviewSection({
  totalContributors,
  totalMergedPRs,
  totalOrganizations,
}: {
  totalContributors: number;
  totalMergedPRs: number;
  totalOrganizations: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-6">
      <OssStatCard
        icon={<PrStatIcon size={64} />}
        title="Total PRs Merged"
        value={totalMergedPRs}
      />
      <OssStatCard
        icon={<OrgStatIcon size={64} />}
        title="Total Orgs"
        value={totalOrganizations}
      />
      <OssStatCard
        icon={<ContributorStatIcon size={64} />}
        title="Total Contributors"
        value={totalContributors}
      />
    </div>
  );
}
