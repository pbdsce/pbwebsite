import Lore from "@/components/lore/Lore";
import LoreType from "@/types/lore/loreType";
import { getAllLores } from "@/lib/server/lore";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";

const PAGE_URL = "https://www.pointblank.club/lore";
const PAGE_TITLE = "Lore | Point Blank";
const PAGE_DESCRIPTION =
  "Explore the stories, memories, and moments that shaped Point Blank — our journey as a student-run open source community from India.";

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

export default async function LorePage() {
  await connectDB();
  const data = await getAllLores();
  const lores: LoreType[] = JSON.parse(JSON.stringify(data));
  lores.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="w-full h-full">
      <Lore lores={lores} />
    </section>
  );
}
