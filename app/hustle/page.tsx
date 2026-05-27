import Hustle from "@/components/hustle/Hustle";
import { type Latest, type Leaderboard, LatestModel, LeaderboardModel } from "@/lib/db/models/hustle";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "PB Hustle",
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
