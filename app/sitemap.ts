import { MetadataRoute } from "next";
import connectDB from "@/lib/db/connection";
import Lore from "@/lib/db/models/lores";
import EventModel from "@/lib/db/models/events";
import MembersModel from "@/lib/db/models/members";
import AchievementsModel from "@/lib/db/models/achievements";
import TalkSchema from "@/lib/db/models/talks";
import { LatestModel, LeaderboardModel } from "@/lib/db/models/hustle";
import ContributionV2 from "@/lib/db/models/contributionsV2";
import type { Model } from "mongoose";

const BASE_URL = "https://www.pointblank.club";

/**
 * Returns the most recent `updatedAt` across a Mongoose collection,
 * or `fallback` if the collection is empty / errors out.
 */
async function latestUpdatedAt<T extends { updatedAt?: Date }>(
  model: Model<T>,
  fallback: Date
): Promise<Date> {
  try {
    const doc = await model
      .findOne()
      .sort({ updatedAt: -1 })
      .select("updatedAt")
      .lean<{ updatedAt?: Date } | null>();
    return doc?.updatedAt ?? fallback;
  } catch (error) {
    console.error("[sitemap] Error fetching latest updatedAt:", error);
    return fallback;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  try {
    await connectDB();

    const [
      loreDate,
      eventsDate,
      membersDate,
      achievementsDate,
      talksDate,
      latestDoc,
      leaderboardDoc,
      ossDate,
    ] = await Promise.all([
      latestUpdatedAt(Lore, now),
      latestUpdatedAt(EventModel, now),
      latestUpdatedAt(MembersModel, now),
      latestUpdatedAt(AchievementsModel, now),
      latestUpdatedAt(TalkSchema, now),
      LatestModel.findOne({ name: "latest" }).select("updateTime").lean(),
      LeaderboardModel.findOne({ name: "leaderboard" })
        .select("updatedAt")
        .lean(),
      latestUpdatedAt(ContributionV2, now),
    ]);

    const hustleDate = new Date(
      Math.max(
        (latestDoc as { updateTime?: Date } | null)?.updateTime?.getTime() ??
          0,
        (leaderboardDoc as { updatedAt?: Date } | null)?.updatedAt?.getTime() ??
          0
      ) || now.getTime()
    );

    return [
      {
        url: `${BASE_URL}/`,
        lastModified: now,
        priority: 1.0,
      },
      {
        url: `${BASE_URL}/events`,
        lastModified: eventsDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/lore`,
        lastModified: loreDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/members`,
        lastModified: membersDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/achievements`,
        lastModified: achievementsDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/talks`,
        lastModified: talksDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/hustle`,
        lastModified: hustleDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/oss`,
        lastModified: ossDate,
        priority: 0.8,
      },
      {
        url: `${BASE_URL}/placements`,
        // Static content (lib/placements-data.ts) — bump this manually
        // whenever placements data is updated for a new batch.
        lastModified: new Date("2026-04-16"),
        priority: 0.8,
      },
    ];
  } catch (error) {
    console.error("[sitemap] Failed to generate dynamic sitemap:", error);
    const staticRoutes = [
      "",
      "/events",
      "/lore",
      "/members",
      "/achievements",
      "/talks",
      "/hustle",
      "/oss",
      "/placements",
    ];
    return staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: now,
      priority: route === "" ? 1.0 : 0.8,
    }));
  }
}