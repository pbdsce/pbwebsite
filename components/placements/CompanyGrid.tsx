"use client";

import { useState } from "react";
import { Lexend_Tera } from "next/font/google";
import { Sparkles } from "lucide-react";
import FadeIn from "@/components/FadeIn";
import {
  HEADLINER_COMPANIES,
  OTHER_COMPANIES,
  type PlacementCompany,
} from "@/lib/placements-data";

const lexendTera = Lexend_Tera({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

function campusTag(c: PlacementCompany) {
  if (c.offCampus > 0 && c.onCampus > 0) return "mixed";
  return c.onCampus > 0 ? "on-campus" : "off-campus";
}

function formatCount(n: number) {
  return n.toString().padStart(2, "0");
}

function CornerOrnament({
  domain,
  fallbackToStealth = false,
}: {
  domain?: string;
  fallbackToStealth?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showStealth = !domain || failed;

  if (showStealth && !fallbackToStealth) return null;

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none select-none"
      style={{
        right: "-24px",
        bottom: "-24px",
        width: "128px",
        height: "128px",
      }}
    >
      {showStealth ? (
        <Sparkles
          strokeWidth={1.25}
          className="w-full h-full text-pbgreen opacity-[0.18] transition-opacity duration-300 group-hover:opacity-30"
          style={{
            filter: "drop-shadow(0 0 18px rgba(55,255,0,0.22))",
          }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=256`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-contain opacity-[0.18] grayscale contrast-125 transition-opacity duration-300 group-hover:opacity-30"
          style={{
            filter: "drop-shadow(0 0 18px rgba(55,255,0,0.18))",
          }}
        />
      )}
    </div>
  );
}

function HeadlinerCard({ company }: { company: PlacementCompany }) {
  const multi = company.offers > 1;
  const tag = campusTag(company);
  return (
    <div
      className={`group relative h-full rounded-3xl border bg-pbcard p-6 sm:p-7 overflow-hidden transition-colors duration-200 ${
        multi
          ? "border-pbgreen/30 hover:border-pbgreen/60"
          : "border-pbborder hover:border-white/20"
      }`}
    >
      {multi && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(120% 80% at 100% 0%, rgba(55,255,0,0.08) 0%, rgba(55,255,0,0) 60%)",
          }}
        />
      )}
      <CornerOrnament domain={company.domain} fallbackToStealth />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 text-white/40 text-xs uppercase tracking-[0.22em]">
            <span>{company.offers === 1 ? "offer" : "offers"}</span>
          </div>
          <div
            className={`mt-1 text-6xl sm:text-7xl font-semibold tabular-nums ${
              multi ? "text-pbgreen" : "text-white"
            }`}
            style={{ letterSpacing: "-0.05em", lineHeight: "1" }}
          >
            {formatCount(company.offers)}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1 text-right">
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full ${
              tag === "on-campus"
                ? "bg-white/[0.06] text-white/70"
                : tag === "off-campus"
                  ? "bg-pbgreen/15 text-pbgreen"
                  : "bg-white/[0.06] text-white/70"
            }`}
          >
            {tag}
          </span>
        </div>
      </div>

      <div className="relative mt-8 sm:mt-10">
        <div className="h-px w-full bg-white/[0.07]" />
        <p
          className={`mt-4 text-lg sm:text-xl text-white font-medium leading-tight ${lexendTera.className}`}
          style={{ letterSpacing: "-0.02em" }}
        >
          {company.name}
        </p>
        {company.note && (
          <p className="mt-1 text-xs text-white/40">{company.note}</p>
        )}
      </div>
    </div>
  );
}

export default function CompanyGrid() {
  const headlinerCount = HEADLINER_COMPANIES.length;
  const otherCount = OTHER_COMPANIES.length;

  return (
    <section
      id="placements-companies"
      className="relative text-white px-4 sm:px-10 lg:px-20 pt-20 sm:pt-24"
    >
      <div className="max-w-8xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Where the <span className="text-pbgreen">batch</span> landed.
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/60 leading-relaxed">
            A roster of the companies that hired us this year — sorted by impact,
            not alphabet.
          </p>
        </FadeIn>

        <FadeIn delay={0.16}>
          <div className="mt-10 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/40">
            <span className="text-pbgreen">Headliners</span>
            <span className="flex-1 h-px bg-white/10" />
            <span className="tabular-nums">{headlinerCount}</span>
          </div>
        </FadeIn>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {HEADLINER_COMPANIES.map((c, i) => (
            <FadeIn
              key={c.name}
              delay={Math.min(i * 0.04, 0.3)}
              y={16}
              className="h-full"
            >
              <HeadlinerCard company={c} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-20 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/40">
            <span>+ 1 offer each from</span>
            <span className="flex-1 h-px bg-white/10" />
            <span className="tabular-nums">{otherCount}</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.18}>
          <div className="mt-6 rounded-3xl border border-pbborder bg-pbcard/60 p-6 sm:p-8 lg:p-10">
            <ul
              className={`flex flex-wrap gap-x-3 gap-y-3 sm:gap-x-5 sm:gap-y-4 text-base sm:text-lg lg:text-xl text-white/85 leading-tight ${lexendTera.className}`}
              style={{ letterSpacing: "-0.02em" }}
            >
              {OTHER_COMPANIES.map((c, i) => (
                <li key={c.name} className="flex items-center gap-3 sm:gap-5">
                  <span>{c.name}</span>
                  {i < OTHER_COMPANIES.length - 1 && (
                    <span aria-hidden className="text-pbgreen/60 select-none">
                      ·
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
