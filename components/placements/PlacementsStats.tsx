"use client";

import FadeIn from "@/components/FadeIn";
import { PLACEMENT_BATCH } from "@/lib/placements-data";

type Stat = {
  value: string;
  label: string;
  caption: string;
  emphasis?: boolean;
};

const stats: Stat[] = [
  {
    value: String(PLACEMENT_BATCH.totalOffers),
    label: "Total offers",
    caption: "across the batch",
  },
  {
    value: String(PLACEMENT_BATCH.companies),
    label: "Companies",
    caption: "from frontier startups to FAANG",
  },
  {
    value: String(PLACEMENT_BATCH.offCampusOffers),
    label: "Off-campus",
    caption: `${PLACEMENT_BATCH.onCampusOffers} on-campus · the rest, hustled`,
    emphasis: true,
  },
];

export default function PlacementsStats() {
  return (
    <section
      id="placements-stats"
      className="relative text-white px-4 sm:px-10 lg:px-20"
    >
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div
                className={`relative h-full rounded-3xl border p-6 sm:p-8 overflow-hidden ${
                  s.emphasis
                    ? "bg-pbcard border-pbgreen/40"
                    : "bg-pbcard border-pbborder"
                }`}
              >
                {s.emphasis && (
                  <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(120% 70% at 100% 0%, rgba(55,255,0,0.10) 0%, rgba(55,255,0,0) 60%)",
                    }}
                  />
                )}
                <div className="relative">
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">
                    {s.label}
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div
                      className={`text-6xl sm:text-7xl font-semibold tabular-nums ${
                        s.emphasis ? "text-pbgreen" : "text-white"
                      }`}
                      style={{ letterSpacing: "-0.04em" }}
                    >
                      {s.value}
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-white/60">{s.caption}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-6 rounded-3xl border border-pbborder bg-pbcard/60 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
              <div className="text-white/50 uppercase tracking-[0.18em]">
                On-campus vs Off-campus
              </div>
              <div className="text-white/70 tabular-nums">
                <span className="text-white/50">on-campus</span>{" "}
                {PLACEMENT_BATCH.onCampusOffers}
                <span className="mx-3 text-white/20">|</span>
                <span className="text-pbgreen">off-campus</span>{" "}
                {PLACEMENT_BATCH.offCampusOffers}
              </div>
            </div>
            <div className="mt-4 h-2 w-full rounded-full bg-white/[0.06] overflow-hidden flex">
              <div
                className="h-full bg-white/30"
                style={{
                  width: `${
                    (PLACEMENT_BATCH.onCampusOffers /
                      PLACEMENT_BATCH.totalOffers) *
                    100
                  }%`,
                }}
              />
              <div
                className="h-full bg-pbgreen"
                style={{
                  width: `${
                    (PLACEMENT_BATCH.offCampusOffers /
                      PLACEMENT_BATCH.totalOffers) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
