import type { Metadata } from "next";
import OssDashboard from "@/components/oss/OssDashboard";

const PAGE_URL = "https://www.pointblank.club/oss";
const PAGE_TITLE = "OSS | Point Blank";
const PAGE_DESCRIPTION = "Open source contributions and merged pull requests of Point Blank members.";

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

export default function OssPage() {
  return (
    <section className="w-full" id="oss">
      <OssDashboard endpoint="/api/contributionsV2" />
    </section>
  );
}
