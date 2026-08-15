import type { Metadata } from "next";
import HomeClient from "@/components/homepage/HomeClient";

const PAGE_TITLE = "Point Blank | Student Run Open Source Community from India";
const PAGE_DESCRIPTION =
  "Point Blank is a student run open source community. We are a group of tech enthusiasts who love to learn and grow together.";
const PAGE_URL = "https://www.pointblank.club";

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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Point Blank",
            url: PAGE_URL,
          }),
        }}
      />
      <HomeClient />
    </>
  );
}