"use client";

import { motion } from "framer-motion";
import { PLACEMENT_BATCH } from "@/lib/placements-data";

export default function PlacementsHero() {
  const offCampusPct = Math.round(
    (PLACEMENT_BATCH.offCampusOffers / PLACEMENT_BATCH.totalOffers) * 100,
  );

  return (
    <section id="placements-hero" className="relative text-white bg-pbpages">
      <div className="max-w-8xl mx-auto px-4 sm:px-10 lg:px-20 pt-28 pb-16 lg:pt-36 lg:pb-20 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-medium tracking-tight text-white whitespace-nowrap"
          style={{ fontSize: "clamp(1.4rem, 5.2vw, 4.5rem)", lineHeight: 1.05 }}
        >
          We don&apos;t wait for campus.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 max-w-2xl text-base sm:text-lg text-white leading-relaxed"
        >
          Batch of {PLACEMENT_BATCH.year} Placements. {PLACEMENT_BATCH.totalOffers}{" "}
          offers across {PLACEMENT_BATCH.companies} companies. {offCampusPct}%
          off-campus. Built on curiosity, Not on luck.
        </motion.p>
      </div>
    </section>
  );
}
