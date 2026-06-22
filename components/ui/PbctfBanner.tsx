"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Flag } from "lucide-react";

const categories = ["Web", "Pwn", "Crypto", "Reversing", "Forensics", "OSINT"];

export default function PbctfBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="group relative w-full overflow-hidden rounded-3xl bg-black border-2 border-pbgreen/40 shadow-[0_0_30px_rgba(55,255,0,0.15)] transition-all duration-300 hover:border-pbgreen/70 hover:shadow-[0_0_45px_rgba(55,255,0,0.28)]"
    >
      {/* Decorative background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(#37ff00 2px, transparent 2px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 35%, transparent 0%, rgba(0,0,0,0.88) 100%)",
          }}
        />
        {/* Animated scanline sweep */}
        <motion.div
          className="absolute inset-x-0 h-24 bg-linear-to-b from-transparent via-pbgreen/10 to-transparent"
          initial={{ top: "-20%" }}
          animate={{ top: ["-20%", "120%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Corner brackets */}
      <span
        aria-hidden="true"
        className="absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-pbgreen/60 rounded-tl-md"
      />
      <span
        aria-hidden="true"
        className="absolute right-3 top-3 h-5 w-5 border-r-2 border-t-2 border-pbgreen/60 rounded-tr-md"
      />
      <span
        aria-hidden="true"
        className="absolute left-3 bottom-3 h-5 w-5 border-l-2 border-b-2 border-pbgreen/60 rounded-bl-md"
      />
      <span
        aria-hidden="true"
        className="absolute right-3 bottom-3 h-5 w-5 border-r-2 border-b-2 border-pbgreen/60 rounded-br-md"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-5 px-6 sm:px-8 py-6 sm:py-7">
        {/* Terminal title bar */}
        <div className="flex items-center justify-between border-b border-pbgreen/15 pb-3">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-pbgreen/80" />
            <span className="font-mono text-[10px] sm:text-xs text-pbtext/70">
              pbctf@pointblank:~$
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <motion.span
              className="h-2 w-2 rounded-full bg-pbgreen shadow-[0_0_8px_rgba(55,255,0,0.9)]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-pbgreen">
              Registrations Open
            </span>
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-pbgreen/10 border border-pbgreen/40">
            <Flag className="h-6 w-6 sm:h-7 sm:w-7 text-pbgreen" />
          </div>
          <div className="min-w-0">
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-pbgreen">
              Capture The Flag
            </span>
            <h3
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none mt-1"
              style={{ textShadow: "0 0 18px rgba(55,255,0,0.45)" }}
            >
              PBCTF <span className="text-pbgreen">5.0</span>
            </h3>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-pbtext leading-relaxed">
          Point Blank&apos;s flagship Capture The Flag Event. Break challenges
          across web, binary exploitation, cryptography and more - solo or with
          your squad.
        </p>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-pbgreen/30 bg-pbgreen/5 px-3 py-1 font-mono text-[10px] sm:text-xs text-pbgreen/90"
            >
              {c}
            </span>
          ))}
        </div>

        {/* Date strips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 rounded-2xl border border-pbgreen/20 bg-pbgreen/4 px-4 py-3">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-pbgreen" />
            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-pbtext/60">
                Register By
              </span>
              <span className="block text-sm sm:text-base font-semibold text-pbgreen leading-tight">
                19th July
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 rounded-2xl border border-pbgreen/20 bg-pbgreen/4 px-4 py-3">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-pbgreen" />

            <div className="min-w-0">
              <span className="block font-mono text-[10px] uppercase tracking-widest text-pbtext/60">
                Hacking Starts
              </span>
              <span className="block text-sm sm:text-base font-semibold text-pbgreen leading-tight">
                26th July
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <a
          href="https://pbctf.pointblank.club"
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn flex items-center justify-center gap-2 rounded-2xl bg-pbgreen px-6 py-3.5 font-semibold text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(55,255,0,0.5)] hover:brightness-110"
        >
          Register Now
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  );
}
