import type { Metadata } from "next";
import PlacementsHero from "@/components/placements/PlacementsHero";
import PlacementsStats from "@/components/placements/PlacementsStats";
import CompanyGrid from "@/components/placements/CompanyGrid";
import PlacementsClosing from "@/components/placements/PlacementsClosing";

export const metadata: Metadata = {
  title: "Placements · Point Blank",
  description:
    "Class of 2026 placements at Point Blank — 32 offers across 26 companies, 75% off-campus.",
};

export default function PlacementsPage() {
  return (
    <main className="bg-pbpages">
      <PlacementsHero />
      <PlacementsStats />
      <CompanyGrid />
      <PlacementsClosing />
    </main>
  );
}
