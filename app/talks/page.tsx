import Talks from "@/components/talks/Talks";
import { getAllTalks } from "@/lib/server/talks";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";

const PAGE_URL = "https://www.pointblank.club/talks";
const PAGE_TITLE = "Talks | Point Blank";
const PAGE_DESCRIPTION =
  "Explore tech talks by Point Blank — sessions on software development, open source, and emerging technologies delivered by our community.";

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
