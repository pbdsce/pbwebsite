"use client";

import Link from "next/link";

export default function Recruitment() {
  return (
    <section className="relative z-20 mx-4 mt-4 sm:mx-6 lg:mx-10">
      <div
        className="
          group relative mx-auto flex max-w-[1800px]
          items-center overflow-hidden
          rounded-2xl
          border-2 border-pbgreen/30
          bg-black
          px-5 py-5
          sm:px-8
          lg:px-10
          transition-all duration-300
          hover:border-pbgreen
          hover:shadow-[0_0_20px_rgba(55,255,0,0.2)]
        "
      >
        {/* Subtle green glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(57,255,20,0.08),transparent_35%)]" />

        {/* Decorative dots */}
        <div
          className="pointer-events-none absolute right-0 top-0 h-full w-[18%] opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(#39ff14 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            maskImage:
              "linear-gradient(to left, black, transparent)",
            WebkitMaskImage:
              "linear-gradient(to left, black, transparent)",
          }}
        />

        <div className="relative flex w-full items-center gap-5 lg:gap-8">

          {/* Heading */}
          <h2
            className="
              shrink-0 whitespace-nowrap
              text-2xl font-black uppercase
              tracking-tight text-white
              sm:text-3xl
              lg:text-4xl
              xl:text-5xl
            "
          >
            WE ARE{" "}
            <span className="text-pbgreen">
              RECRUITING!
            </span>
          </h2>

          {/* Divider */}
          <div className="hidden h-14 w-px bg-pbgreen/25 lg:block" />

          {/* Message */}
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="text-sm font-medium text-white xl:text-base">
              Think you could be a part of Point Blank?
            </p>

            <p className="mt-1 text-sm font-medium text-pbgreen xl:text-base">
              We&apos;d love to have you.
            </p>
          </div>

          {/* CTA */}
          <Link
            href="/recruitment"
            className="
              ml-auto flex shrink-0 items-center gap-2
              rounded-xl
              bg-pbgreen
              px-5 py-3.5
              text-sm font-bold text-black
              transition-all duration-300
              hover:shadow-[0_0_20px_rgba(55,255,0,0.4)]
              hover:brightness-110
              sm:px-6
            "
          >
            Apply Now

            <span className="transition-transform duration-300 hover:translate-x-0.5 hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}