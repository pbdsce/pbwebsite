import Members from "@/components/members/Members";
import { getAllMembers } from "@/lib/server/members";
import connectDB from "@/lib/db/connection";
import type { Metadata } from "next";

const PAGE_URL = "https://www.pointblank.club/members";
const PAGE_TITLE = "Members | Point Blank";
const PAGE_DESCRIPTION =
  "Meet the members of Point Blank — the student developers, designers, and tech enthusiasts building our open source community from India.";

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

export default async function Events() {
  await connectDB();
  const allMembers = await getAllMembers();

  const members = JSON.parse(JSON.stringify(allMembers));

  return (
    <section className="w-full h-full" id="members">
      <Members members={members} />
    </section>
  );
}
