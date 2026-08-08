"use client";

import { motion } from "framer-motion";

export default function OssHero() {
  return (
    <div className="flex flex-col items-center px-1 pb-8 pt-4 text-center sm:px-3 sm:pb-12 sm:pt-8">
      <motion.h1
        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="text-balance text-3xl font-medium tracking-tight text-white sm:text-4xl md:text-5xl lg:text-7xl"
      >
        Our Open Source Footprint
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-4 max-w-5xl text-balance text-sm font-light leading-relaxed text-zinc-400 sm:mt-8 sm:text-base md:text-lg lg:text-2xl"
      >
        Every merged pull request from a Point Blank member, in one place.
        From first-year first PRs to alumni still shipping years later, it all
        counts, and it all lives here.
      </motion.p>
    </div>
  );
}
