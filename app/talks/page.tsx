import Talks from "@/components/talks/Talks";
import { getAllTalks } from "@/lib/server/talks";
import connectDB from "@/lib/db/connection";

export const metadata = {
  title: "Talks",
};

export default async function TalksPage() {
  await connectDB();
  const allTalks = await getAllTalks();

  const talks = JSON.parse(JSON.stringify(allTalks));

  return (
    <section className="w-full h-full" id="talks">
      <Talks talks={talks} />
    </section>
  );
}
