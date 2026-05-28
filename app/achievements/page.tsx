import Achievements from "@/components/achievements/Achievements";
import { getAllAchievements } from "@/lib/server/achievements";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "Achievements",
  description: "Achievements page",
};

export default async function AchievementsPage() {
  await connectDB();
  const achievements = await getAllAchievements();

  const docs = JSON.parse(JSON.stringify(achievements));

  return <Achievements initialDocs={docs} />;
}
