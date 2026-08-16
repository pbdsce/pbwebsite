import Hustle from "@/components/hustle/Hustle";
import { type Latest, type Leaderboard, LatestModel, LeaderboardModel } from "@/lib/db/models/hustle";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";

const PAGE_URL = "https://www.pointblank.club/hustle";
const PAGE_TITLE = "PB Hustle | Point Blank";
const PAGE_DESCRIPTION =
  "PB Hustle is Point Blank's weekly coding challenge where student developers compete, sharpen their skills, and track their progress.";

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

export default async function HustlePage() {
  await connectDB();

  const latestDoc = await LatestModel.findOne({ name: "latest" }).lean();
  const leaderboardDoc = await LeaderboardModel.findOne({ name: "leaderboard" }).lean();

  const latest: Latest | null = latestDoc ? JSON.parse(JSON.stringify(latestDoc)) : null;
  const leaderboard: Leaderboard | null = leaderboardDoc ? JSON.parse(JSON.stringify(leaderboardDoc)) : null;

  return (
    <section className="w-full h-full" id="hustle">
      <Hustle latest={latest} leaderboard={leaderboard} />
    </section>
  );
}
