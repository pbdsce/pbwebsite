"use client";

import Link from "next/link";

export default function Recruitment() {
  return (
    <section className="relative z-20 mx-4 mt-4 sm:mx-6 lg:mx-10">
      <div
        className="
          group relative mx-auto flex max-w-450
          flex-col items-center overflow-hidden
          rounded-2xl border-2 border-pbgreen/30 bg-black
          p-5 sm:p-6 lg:flex-row lg:px-10 lg:py-6
          transition-all duration-300
          hover:border-pbgreen
          hover:shadow-[0_0_20px_rgba(55,255,0,0.2)]
        "
      >
        {/* Subtle green glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.08),transparent_50%)] lg:bg-[radial-gradient(circle_at_15%_50%,rgba(57,255,20,0.08),transparent_35%)]" />

        {/* Decorative dots pattern */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-10 sm:w-1/3 sm:opacity-20 lg:w-[18%]"
          style={{
            backgroundImage: "radial-gradient(#39ff14 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />

        <div className="relative flex w-full flex-col items-center gap-4 text-center sm:gap-5 lg:flex-row lg:gap-8 lg:text-left">
          
          {/* Heading */}
          <h2
            className="
              text-xl font-black uppercase tracking-tight text-white
              xs:text-2xl sm:text-3xl lg:shrink-0 lg:text-4xl xl:text-5xl
            "
          >
            
            <span className="text-pbgreen">
              RECRUITING!
            </span>
          </h2>

          {/* Divider (Desktop only) */}
          <div className="hidden h-12 w-px bg-pbgreen/25 lg:block" />

          {/* Supporting text - visible on all screens */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white sm:text-sm xl:text-base">
              Think you could be a part of Point Blank?
            </p>
            <p className="mt-0.5 text-xs font-medium text-pbgreen sm:text-sm xl:text-base">
              We&apos;d love to have you.
            </p>
          </div>

          {/* CTA Button */}
          <Link
            href="/recruitment"
            className="
              flex w-full items-center justify-center gap-2
              rounded-xl bg-pbgreen px-6 py-3 text-sm font-bold text-black
              transition-all duration-300
              hover:brightness-110 hover:shadow-[0_0_20px_rgba(55,255,0,0.4)]
              sm:w-auto sm:px-6 sm:py-3.5 lg:ml-auto lg:shrink-0
            "
          >
            Apply Now
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>

        </div>
      </div>
    </section>
  );
}