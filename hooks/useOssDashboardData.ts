"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createEmptyOssResponse,
  normalizeContributionsData,
  type ContributionsCollectionResponse,
  type ContributionsContributorRow,
  type ContributionsOrganizationRow,
  type ContributionsStatsResponse,
  type NormalizedOssData,
  type NormalizedOssOrganization,
} from "@/lib/oss";
import { buildViewUrl } from "@/components/oss/utils";
import type {
  ContributorView,
  OrganizationView,
} from "@/components/oss/types";

export function useOssDashboardData(endpoint: string) {
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<NormalizedOssData>(() =>
    createEmptyOssResponse(),
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadOssData() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const [statsResponse, organizationsResponse, contributorsResponse] =
          await Promise.all([
            fetch(buildViewUrl(endpoint, "stats"), {
              signal: controller.signal,
              cache: "no-store",
            }),
            fetch(buildViewUrl(endpoint, "orgs"), {
              signal: controller.signal,
              cache: "no-store",
            }),
            fetch(buildViewUrl(endpoint, "contributors"), {
              signal: controller.signal,
              cache: "no-store",
            }),
          ]);

        if (
          !statsResponse.ok ||
          !organizationsResponse.ok ||
          !contributorsResponse.ok
        ) {
          const failedResponse = !statsResponse.ok
            ? statsResponse
            : !organizationsResponse.ok
              ? organizationsResponse
              : contributorsResponse;
          throw new Error(
            `Contributions route returned ${failedResponse.status}`,
          );
        }

        const [statsPayload, organizationsPayload, contributorsPayload] =
          await Promise.all([
            statsResponse.json() as Promise<ContributionsStatsResponse>,
            organizationsResponse.json() as Promise<
              ContributionsCollectionResponse<ContributionsOrganizationRow>
            >,
            contributorsResponse.json() as Promise<
              ContributionsCollectionResponse<ContributionsContributorRow>
            >,
          ]);

        setData(
          normalizeContributionsData({
            stats: statsPayload,
            organizations: organizationsPayload.data,
            contributors: contributorsPayload.data,
          }),
        );
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted) return;

        setData(createEmptyOssResponse());
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load OSS contributions right now.",
        );
      }
    }

    void loadOssData();

    return () => controller.abort();
  }, [endpoint]);

  const { organizationStats, contributorStats } = useMemo(() => {
    const contributorsById = new Map(
      data.contributors.map((contributor) => [contributor.id, contributor]),
    );
    const organizationsById = new Map(
      data.organizations.map((organization) => [organization.id, organization]),
    );

    const organizations: OrganizationView[] = data.organizations.map(
      (organization) => ({
        ...organization,
        contributors: organization.contributorIds
        .map((contributorId) => {
        const contributor = contributorsById.get(contributorId);

        if (!contributor) return null;

    return {
      id: contributor.id,
      name: contributor.name,
      login: contributor.login ?? contributor.id, // 🔥 FIX
    };
  })
  .filter((c): c is { id: string; name: string; login: string } => Boolean(c)),
      }),
    );

    const contributors: ContributorView[] = data.contributors.map(
      (contributor) => ({
        ...contributor,
        organizations: contributor.organizationIds
          .map((organizationId) => organizationsById.get(organizationId))
          .filter(
            (organization): organization is NormalizedOssOrganization =>
              Boolean(organization),
          ),
      }),
    );

    return {
      organizationStats: organizations,
      contributorStats: contributors,
    };
  }, [data]);

  return {
    data,
    errorMessage,
    organizationStats,
    contributorStats,
    status,
  };
}
