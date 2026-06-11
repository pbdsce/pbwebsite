"use client";

import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function PlacementsClosing() {
  return (
    <section
      id="placements-closing"
      className="relative text-white px-4 sm:px-10 lg:px-20 pt-24 pb-24"
    >
      <div className="max-w-8xl mx-auto">
        <FadeIn>
          <div className="relative overflow-hidden rounded-4xl border border-pbborder bg-pbcard p-8 sm:p-12 lg:p-16">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(70% 60% at 100% 0%, rgba(55,255,0,0.10) 0%, rgba(55,255,0,0) 60%), radial-gradient(50% 50% at 0% 100%, rgba(55,255,0,0.06) 0%, rgba(55,255,0,0) 60%)",
              }}
            />
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-pbgreen/90">
                  Hiring?
                </p>
                <h3 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">
                  Hire from this <br className="hidden sm:block" />
                  list <span className="text-pbgreen">next year.</span>
                </h3>
                <p className="mt-4 max-w-xl text-sm sm:text-base text-white/65 leading-relaxed">
                  Point Blank is a student-run community of builders who
                  don&apos;t wait to be hand-fed problems. Post a role on our
                  careers portal and we&apos;ll get it in front of the batch.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
                <a
                  href="https://careers.pointblank.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-pbgreen px-6 py-3 text-sm font-semibold text-black hover:brightness-110 transition-all"
                >
                  Hire from PB →
                </a>
                <Link
                  href="/members"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white hover:bg-white/5 transition-all"
                >
                  Meet the members
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-10 text-center text-xs text-white/35 max-w-2xl mx-auto leading-relaxed">
            Data reflects offers received by the Point Blank cohort, Class of
            2026. Out of respect for individual privacy, names are not
            displayed.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
