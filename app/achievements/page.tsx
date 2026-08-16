import Achievements from "@/components/achievements/Achievements";
import { getAllAchievements } from "@/lib/server/achievements";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";

const PAGE_URL = "https://www.pointblank.club/achievements";
const PAGE_TITLE = "Achievements | Point Blank";
const PAGE_DESCRIPTION =
  "See the milestones and achievements of Point Blank — recognitions, wins, and accomplishments from our community.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};
export default async function AchievementsPage() {
  await connectDB();
  const achievements = await getAllAchievements();

  const docs = JSON.parse(JSON.stringify(achievements));

  return <Achievements initialDocs={docs} />;
}
