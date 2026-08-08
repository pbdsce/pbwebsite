"use client";

import { useState } from "react";
import type {
  ContributorView,
  DashboardTab,
  OrganizationView,
} from "@/components/oss/types";
import OssSectionHeader from "@/components/oss/widgets/OssSectionHeader";
import OssEmptyState from "@/components/oss/widgets/OssEmptyState";
import OssOrganizationPreviewCard from "@/components/oss/widgets/OssOrganizationPreviewCard";
import OssContributorPreviewCard from "@/components/oss/widgets/OssContributorPreviewCard";

export default function OssHighlightsSection({
  contributorStats,
  organizationStats,
  onTabChange,
}: {
  contributorStats: ContributorView[];
  organizationStats: OrganizationView[];
  onTabChange: (tab: DashboardTab) => void;
}) {
  const [flippedOrgId, setFlippedOrgId] = useState<string | null>(null);
  const [flippedContributorId, setFlippedContributorId] = useState<
    string | null
  >(null);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
      <div>
        <OssSectionHeader
          title="Top Organizations"
          onViewAll={() => onTabChange("organizations")}
        />
        <div className="space-y-3">
          {organizationStats.length === 0 ? (
            <OssEmptyState message="No organizations yet." />
          ) : (
            organizationStats
              .slice(0, 5)
              .map((organization) => (
                <OssOrganizationPreviewCard
                  key={organization.id}
                  organization={organization}
                  flipped={flippedOrgId === organization.id}
                  onToggleFlip={() =>
                    setFlippedOrgId((current) =>
                      current === organization.id ? null : organization.id,
                    )
                  }
                />
              ))
          )}
        </div>
      </div>

      <div>
        <OssSectionHeader
          title="Top Contributors"
          onViewAll={() => onTabChange("contributors")}
        />
        <div className="space-y-3">
          {contributorStats.length === 0 ? (
            <OssEmptyState message="No contributors yet." />
          ) : (
            contributorStats
              .slice(0, 5)
              .map((contributor) => (
                <OssContributorPreviewCard
                  key={contributor.id}
                  contributor={contributor}
                  flipped={flippedContributorId === contributor.id}
                  onToggleFlip={() =>
                    setFlippedContributorId((current) =>
                      current === contributor.id ? null : contributor.id,
                    )
                  }
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
}
