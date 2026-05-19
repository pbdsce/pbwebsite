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
        title="Total PRs Merged"
        value={totalMergedPRs}
      />
      <OssStatCard
        title="Unique Orgs"
        value={totalOrganizations}
      />
      <OssStatCard
        title="Contributors"
        value={totalContributors}
      />
    </div>
  );
}
