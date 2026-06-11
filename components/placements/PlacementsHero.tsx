"use client";

import { Lexend_Tera } from "next/font/google";
import { motion } from "framer-motion";
import { PLACEMENT_BATCH } from "@/lib/placements-data";

const lexendTera = Lexend_Tera({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const headingParts = [
  {
    text: "We don't wait",
    className:
      "bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent font-semibold",
  },
  { br: true },
  {
    text: "for ",
    className:
      "bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent font-semibold",
  },
  { text: "campus.", className: "text-pbgreen font-semibold" },
];

export default function PlacementsHero() {
  const offCampusPct = Math.round(
    (PLACEMENT_BATCH.offCampusOffers / PLACEMENT_BATCH.totalOffers) * 100,
  );

  return (
    <section
      id="placements-hero"
      className="relative z-10 overflow-hidden text-white bg-pbpages"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(55,255,0,0.10) 0%, rgba(55,255,0,0) 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(60% 60% at 50% 30%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative max-w-8xl mx-auto px-4 sm:px-10 lg:px-20 pt-28 pb-20 lg:pt-36 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs sm:text-sm tracking-[0.25em] uppercase text-pbgreen/90"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-pbgreen animate-pulse" />
          Class of {PLACEMENT_BATCH.year} · Placements
        </motion.div>

        <h1
          className={`mt-6 text-5xl sm:text-6xl md:text-7xl xl:text-8xl tracking-[-0.04em] leading-[0.95] ${lexendTera.className}`}
        >
          {headingParts.map((part, idx) =>
            part.br ? (
              <br key={idx} />
            ) : (
              <motion.span
                key={idx}
                className={part.className}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.05 }}
              >
                {part.text}
              </motion.span>
            ),
          )}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed"
        >
          {PLACEMENT_BATCH.totalOffers} offers across {PLACEMENT_BATCH.companies}{" "}
          companies.{" "}
          <span className="text-white">{offCampusPct}% off-campus.</span>{" "}
          Built on curiosity. Not on luck.
        </motion.p>
      </div>
    </section>
  );
}
