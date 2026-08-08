"use client";

import { useState } from "react";
import type {
  ContributorSortOptionId,
  ContributorView,
} from "@/components/oss/types";
import { CONTRIBUTOR_SORT_OPTIONS } from "@/components/oss/utils";
import OssContributorCard from "@/components/oss/widgets/OssContributorCard";
import OssFilterGroup from "@/components/oss/widgets/OssFilterGroup";
import OssFilterMenu from "@/components/oss/widgets/OssFilterMenu";
import OssSearchInput from "@/components/oss/widgets/OssSearchInput";

const PAGE_SIZE = 12;

export default function OssContributorsPanel({
  contributorSort,
  contributors,
  onContributorSortChange,
  onSearchQueryChange,
  searchQuery,
}: {
  contributorSort: ContributorSortOptionId;
  contributors: ContributorView[];
  onContributorSortChange: (value: ContributorSortOptionId) => void;
  onSearchQueryChange: (value: string) => void;
  searchQuery: string;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [prevContributors, setPrevContributors] = useState(contributors);
  const [flippedId, setFlippedId] = useState<string | null>(null);

  if (contributors !== prevContributors) {
    setPrevContributors(contributors);
    setVisibleCount(PAGE_SIZE);
  }

  const visibleContributors = contributors.slice(0, visibleCount);
  const hasMore = visibleCount < contributors.length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
        <h2 className="shrink-0 text-2xl font-normal text-pbgreen sm:text-3xl">
          Contributors
        </h2>
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto md:items-start md:justify-end">
          <OssSearchInput
            value={searchQuery}
            onChange={onSearchQueryChange}
            placeholder="Search contributors"
          />
          <OssFilterMenu>
            {({ close }) => (
              <OssFilterGroup
                activeId={contributorSort}
                options={CONTRIBUTOR_SORT_OPTIONS}
                onChange={(value) => {
                  onContributorSortChange(value);
                  close();
                }}
                className="flex flex-col"
              />
            )}
          </OssFilterMenu>
        </div>
      </div>

      {contributors.length === 0 ? (
        <div className="rounded-[20px] bg-pbgray py-20 text-center">
          <p className="font-medium text-zinc-500">
            No contributors found matching your criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
            {visibleContributors.map((contributor) => (
              <OssContributorCard
                key={contributor.id}
                contributor={contributor}
                flipped={flippedId === contributor.id}
                onToggleFlip={() =>
                  setFlippedId((current) =>
                    current === contributor.id ? null : contributor.id,
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
