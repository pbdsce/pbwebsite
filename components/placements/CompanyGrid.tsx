"use client";

import { useState } from "react";
import FadeIn from "@/components/FadeIn";
import {
  HEADLINER_COMPANIES,
  OTHER_COMPANIES,
  type PlacementCompany,
} from "@/lib/placements-data";

function formatCount(n: number) {
  return n.toString().padStart(2, "0");
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function CompanyLogo({ name, domain }: { name: string; domain?: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!domain || failed) {
    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-pbgray border border-pbborder flex items-center justify-center text-[10px] font-semibold text-white/70">
        {initials}
      </div>
    );
  }

  return (
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-pbborder flex items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={`${name} logo`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="w-2/3 h-2/3 object-contain"
      />
    </div>
  );
}

function HeadlinerCard({ company }: { company: PlacementCompany }) {
  return (
    <div className="group h-full rounded-3xl border border-pbborder bg-pbcard p-6 sm:p-7 transition-colors duration-200 hover:border-pbgreen/60">
      <div className="flex items-center justify-between gap-3">
        <span className="text-white/40 text-xs uppercase tracking-[0.22em]">
          {company.offers === 1 ? "offer" : "offers"}
        </span>
        <CompanyLogo name={company.name} domain={company.domain} />
      </div>

      <div
        className={`mt-3 text-6xl sm:text-7xl font-semibold tabular-nums ${
          company.offers > 1 ? "text-pbgreen" : "text-white"
        }`}
        style={{ letterSpacing: "-0.05em", lineHeight: "1" }}
      >
        {formatCount(company.offers)}
      </div>

      <div className="mt-8 sm:mt-10">
        <div className="h-px w-full bg-white/[0.07]" />
        <p className="mt-4 text-lg sm:text-xl text-white font-medium leading-tight">
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
  return (
    <section
      id="placements-companies"
      className="relative text-white px-4 sm:px-10 lg:px-20 pt-20 sm:pt-24"
    >
      <div className="max-w-8xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-semibold text-center">
            Where the <span className="text-pbgreen">batch</span> landed.
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <p className="mt-3 max-w-2xl mx-auto text-center text-sm sm:text-base text-white/60 leading-relaxed">
            A roster of the companies that hired us this year, sorted by
            impact rather than alphabetically.
          </p>
        </FadeIn>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 xl:grid-flow-dense">
          {HEADLINER_COMPANIES.map((c, i) => (
            <FadeIn
              key={c.name}
              delay={Math.min(i * 0.04, 0.3)}
              y={16}
              className={`h-full ${
                c.name === "VISA" ? "sm:col-start-2 lg:col-start-3 xl:col-start-4" : ""
              }`}
            >
              <HeadlinerCard company={c} />
            </FadeIn>
          ))}

          <FadeIn delay={0.1} className="col-span-full xl:col-start-2 xl:col-span-2">
            <div className="h-full rounded-3xl border border-pbborder bg-pbcard p-6 sm:p-8 flex flex-col items-center justify-center gap-5 text-center overflow-hidden">
              <span className="text-white/40 text-xs uppercase tracking-[0.22em]">
                Additional offers from
              </span>
              <div className="flex flex-col items-center gap-2 text-xs sm:text-sm text-pbgreen leading-relaxed">
                {chunk(OTHER_COMPANIES, 6).map((row, rowIdx) => (
                  <div
                    key={rowIdx}
                    className="flex flex-nowrap items-center justify-center gap-x-2 sm:gap-x-3"
                  >
                    {row.map((c, i) => {
                      return (
                        <span key={c.name} className="inline-flex items-center gap-2 sm:gap-3 whitespace-nowrap">
                          {c.name}
                          {i < row.length - 1 && (
                            <span aria-hidden className="text-white/20">
                              ·
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
