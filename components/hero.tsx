"use client";

import { motion } from "framer-motion";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { GSOC_LIGHT, GSOC_YELLOW } from "@/components/hero/constants";
import { useCountUp } from "@/components/hero/use-count-up";
import { ConfettiProvider } from "@/components/hero/confetti";
import { PBLogo } from "@/components/hero/pb-logo";
import { GsocLogo } from "@/components/hero/gsoc-logo";
import { Dominates } from "@/components/hero/dominates";
import { BigStat } from "@/components/hero/big-stat";
import "../app/css/additional-styles/landing.css";

export default function Hero() {
  const mentees = useCountUp(13, 2.0, 0.6);
  const mentors = useCountUp(3, 1.6, 0.9);

  return (
    <section className="relative min-h-screen md:h-screen flex justify-center items-center overflow-hidden hero-section">
      <FlickeringGrid
        className="z-0 absolute inset-0 w-full h-full"
        squareSize={8}
        gridGap={10}
        color="green"
        maxOpacity={0.22}
        flickerChance={0.5}
      />

      {/* gold + green stage glow at the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 110%, rgba(244,180,0,0.28) 0%, rgba(244,180,0,0) 60%), radial-gradient(80% 65% at 50% 115%, rgba(0,200,83,0.45) 0%, rgba(0,200,83,0) 65%)",
        }}
      />

      {/* breathing pulse */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(50% 38% at 50% 110%, rgba(255,210,74,0.22) 0%, rgba(255,210,74,0) 70%)",
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* celebratory stage rays from the bottom */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen opacity-70"
        style={{
          background:
            "conic-gradient(from 270deg at 50% 115%, transparent 0deg, rgba(244,180,0,0.18) 6deg, transparent 14deg, transparent 30deg, rgba(244,180,0,0.10) 42deg, transparent 52deg, transparent 95deg, rgba(0,200,83,0.16) 108deg, transparent 122deg, transparent 360deg)",
          maskImage: "linear-gradient(to top, black 0%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 75%)",
        }}
      />

      <ConfettiProvider>
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-24 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[clamp(22px,3.6vw,40px)] font-semibold leading-tight text-white">
              <PBLogo height={36} />
              <Dominates />
            </p>
            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
              <GsocLogo size={96} />
              <h1
                className="text-[clamp(34px,6vw,68px)] font-extrabold leading-tight"
                style={{
                  color: GSOC_YELLOW,
                  textShadow: `0 0 24px ${GSOC_YELLOW}55, 0 0 60px ${GSOC_YELLOW}33`,
                }}
              >
                GSoC 2026
              </h1>
            </div>
          </motion.div>

          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 max-w-3xl mx-auto">
            <BigStat value={mentees} label="Mentees" delay={0.5} />
            <BigStat value={mentors} label="Mentors" delay={0.75} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-10 sm:mt-12 text-sm sm:text-base text-white/75 max-w-2xl mx-auto"
          >
            Hearty congratulations to all{" "}
            <span style={{ color: GSOC_LIGHT }}>13 mentees</span> and{" "}
            <span style={{ color: GSOC_LIGHT }}>3 mentors</span> who made
            history this year.
          </motion.p>
        </div>
      </ConfettiProvider>
    </section>
  );
}
