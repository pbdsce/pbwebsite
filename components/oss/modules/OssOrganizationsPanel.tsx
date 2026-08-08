"use client";

import { useState } from "react";
import type {
  OrganizationSortOptionId,
  OrganizationTagFilter,
  OrganizationView,
} from "@/components/oss/types";
import {
  ORGANIZATION_SORT_OPTIONS,
  ORGANIZATION_TAG_OPTIONS,
  SHOW_ORGANIZATION_TAGS,
} from "@/components/oss/utils";
import OssFilterGroup from "@/components/oss/widgets/OssFilterGroup";
import OssFilterMenu from "@/components/oss/widgets/OssFilterMenu";
import OssOrganizationCard from "@/components/oss/widgets/OssOrganizationCard";
import OssSearchInput from "@/components/oss/widgets/OssSearchInput";

const PAGE_SIZE = 12;

export default function OssOrganizationsPanel({
  onOrganizationTagChange,
  onOrgSortChange,
  onSearchQueryChange,
  organizationTag,
  orgSort,
  organizations,
  searchQuery,
}: {
  onOrganizationTagChange: (value: OrganizationTagFilter) => void;
  onOrgSortChange: (value: OrganizationSortOptionId) => void;
  onSearchQueryChange: (value: string) => void;
  organizationTag: OrganizationTagFilter;
  orgSort: OrganizationSortOptionId;
  organizations: OrganizationView[];
  searchQuery: string;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [prevOrganizations, setPrevOrganizations] = useState(organizations);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  if (organizations !== prevOrganizations) {
    setPrevOrganizations(organizations);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleOrganizations = organizations.slice(0, visibleCount);
  const hasMore = visibleCount < organizations.length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <h2 className="shrink-0 text-2xl font-normal text-pbgreen sm:text-3xl">
          Organizations
        </h2>
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-start md:justify-end">
          <OssSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search organizations"
          />
          <OssFilterMenu>
            {({ close }) => (
              <div className="space-y-1">
                <OssFilterGroup
                  activeId={orgSort}
                  options={ORGANIZATION_SORT_OPTIONS}
                  onChange={(value) => {
                    onOrgSortChange(value);
                    close();
                  }}
                  className="flex flex-col"
                />

                {SHOW_ORGANIZATION_TAGS && (
                  <OssFilterGroup
                    activeId={organizationTag}
                    options={ORGANIZATION_TAG_OPTIONS}
                    onChange={(value) => {
                      onOrganizationTagChange(value);
                      close();
                    }}
                    className="flex flex-col border-t border-[#2a2a2a] pt-1"
                  />
                )}
              </div>
            )}
          </OssFilterMenu>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-[20px] bg-[#1c1c1c] py-20 text-center">
          <p className="font-medium text-zinc-500">
            No organizations found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
            {visibleOrganizations.map((organization) => (
              <OssOrganizationCard
                key={organization.id}
                organization={organization}
                flipped={flippedId === organization.id}
                onToggleFlip={() =>
                  setFlippedId((current) =>
                    current === organization.id ? null : organization.id,
                  )
                }
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center sm:mt-10">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="rounded-[10px] border border-pbborder bg-pbdarkgray px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-pbborder"
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
