"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from "framer-motion";

const PB_GREEN = "#00c853";
// GSoC's brand color — the warm yellow/orange of the official GSoC logo.
const GSOC_YELLOW = "#F4B400";
const CONFETTI_COLORS = [
  "#00c853",
  "#7CFFB2",
  "#F4B400",
  "#ffffff",
  "#FF6F61",
  "#4FC3F7",
];

function useCountUp(target: number, duration = 1.6, delay = 0) {
  const value = useMotionValue(0);
  const rounded = useTransform(value, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(value, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [target, duration, delay, value, rounded]);

  return display;
}

// Official-style GSoC mark — a tilted yellow rounded-square with the </> glyph
function GsocLogo({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
    >
      <defs>
        <linearGradient id="gsocGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD24A" />
          <stop offset="100%" stopColor="#F4A100" />
        </linearGradient>
      </defs>
      <g transform="rotate(45 24 24)">
        <rect
          x="6"
          y="6"
          width="36"
          height="36"
          rx="6"
          fill="url(#gsocGrad)"
          stroke="#7a4f00"
          strokeWidth="1"
        />
      </g>
      {/* </> glyph upright */}
      <g
        fill="none"
        stroke="#1a1100"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 19l-5 5 5 5" />
        <path d="M29 19l5 5-5 5" />
      </g>
    </svg>
  );
}

// Celebratory party-popper — quick custom SVG
function PartyPopper({ size = 22 }: { size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      animate={{ rotate: [-8, 6, -8] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className="drop-shadow-[0_0_10px_rgba(0,200,83,0.55)]"
    >
      {/* cone */}
      <path d="M3 21l4-12 9 8z" fill="#00c853" />
      <path d="M3 21l4-12 4 1z" fill="#7CFFB2" opacity="0.85" />
      {/* sparks */}
      <circle cx="14" cy="6" r="1.4" fill="#F4B400" />
      <circle cx="18" cy="9" r="1.1" fill="#FF6F61" />
      <circle cx="20" cy="4" r="1" fill="#4FC3F7" />
      <circle cx="11" cy="3" r="1" fill="#ffffff" />
      <path
        d="M16 12l1.6 1.6M19 7l1.6-1.6M14 9l-1.6-1.6"
        stroke="#F4B400"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

type ConfettiSeed = {
  id: number;
  left: number;
  size: number;
  color: string;
  rotate: number;
  duration: number;
  delay: number;
  drift: number;
  shape: "rect" | "circle" | "tri";
};

function Confetti({ count = 22 }: { count?: number }) {
  // Deterministic seeds — generated once per mount so SSR/CSR stay aligned
  const seeds: ConfettiSeed[] = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      // simple LCG so values are stable per render-run
      const r = (n: number) =>
        ((Math.sin((i + 1) * (n + 1) * 9301) + 1) / 2) % 1;
      return {
        id: i,
        left: r(1) * 100,
        size: 3 + r(2) * 5,
        color: CONFETTI_COLORS[Math.floor(r(3) * CONFETTI_COLORS.length)],
        rotate: r(4) * 360,
        duration: 5 + r(5) * 6,
        delay: -r(6) * 8,
        drift: (r(7) - 0.5) * 60,
        shape: (["rect", "circle", "tri"] as const)[Math.floor(r(8) * 3)],
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {seeds.map((s) => (
        <motion.span
          key={s.id}
          style={{
            position: "absolute",
            top: -10,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: s.shape === "tri" ? undefined : s.color,
            borderRadius: s.shape === "circle" ? "9999px" : "1px",
            clipPath:
              s.shape === "tri"
                ? "polygon(50% 0%, 0% 100%, 100% 100%)"
                : undefined,
            backgroundColor: s.shape === "tri" ? s.color : undefined,
            opacity: 0.85,
            boxShadow: `0 0 6px ${s.color}66`,
          }}
          animate={{
            y: ["-10%", "120%"],
            x: [0, s.drift],
            rotate: [s.rotate, s.rotate + 360],
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.1, 0.9, 1],
          }}
        />
      ))}
    </div>
  );
}

export default function GSOCBanner() {
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt + mouse-tracked spotlight
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), {
    stiffness: 160,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), {
    stiffness: 160,
    damping: 22,
  });
  const spotlight = useTransform([mouseX, mouseY], ([x, y]) =>
    `radial-gradient(380px circle at ${(x as number) * 100}% ${
      (y as number) * 100
    }%, rgba(0,200,83,0.22), transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };
  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const mentees = useCountUp(13, 1.8, 0.4);
  const mentors = useCountUp(3, 1.4, 0.7);

  return (
    <div
      className="w-full"
      data-aos="zoom-y-out"
      data-aos-delay="600"
      style={{ perspective: 1100 }}
      role="img"
      aria-label="Point Blank — 13 mentees and 3 mentors selected for Google Summer of Code 2026"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative rounded-[28px]"
      >
        <div className="relative overflow-hidden rounded-[28px] bg-[#050905] border border-[#00c853]/40 shadow-[0_20px_60px_-20px_rgba(0,200,83,0.45)] group-hover:border-[#00c853]/70 transition-colors duration-500">
          {/* base aurora — bright green pooled at the bottom, like the poster */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 70% at 50% 115%, rgba(0,200,83,0.55) 0%, rgba(0,200,83,0.18) 35%, rgba(0,0,0,0) 65%)",
            }}
          />
          {/* breathing pulse */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 50% at 50% 110%, rgba(244,180,0,0.18) 0%, rgba(244,180,0,0) 60%)",
            }}
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* subtle grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,200,83,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.6) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(120% 100% at 50% 0%, black 30%, transparent 80%)",
            }}
          />
          {/* CONFETTI */}
          <Confetti />
          {/* mouse spotlight */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: spotlight as unknown as string }}
          />

          <div className="relative p-5">
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <PartyPopper />
                <span
                  className="font-serif italic text-[15px] tracking-tight"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #ffffff 0%, #9af7be 60%, #00c853 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Making history
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 rounded-full border bg-black/40 px-2.5 py-1 backdrop-blur-sm"
                style={{ borderColor: `${GSOC_YELLOW}55` }}
              >
                <GsocLogo size={14} />
                <span
                  className="font-bold tracking-tight text-[11px]"
                  style={{ color: GSOC_YELLOW }}
                >
                  GSoC ’26
                </span>
              </div>
            </div>

            {/* Stats — the centerpiece */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatBlock value={mentees} label="Mentees" />
              <StatBlock value={mentors} label="Mentors" delay={0.2} />
            </div>

            {/* Headline line — GSoC name + logo, brand-yellow */}
            <p className="mt-4 flex items-center gap-2 text-[14px] font-semibold leading-snug text-white">
              <span>Selections in</span>
              <GsocLogo size={18} />
              <span
                className="font-bold tracking-tight"
                style={{
                  color: GSOC_YELLOW,
                  textShadow: `0 0 14px ${GSOC_YELLOW}40`,
                }}
              >
                Google Summer of Code 2026
              </span>
            </p>
            <p className="mt-1 text-[12px] leading-snug text-white/60">
              Hearty congratulations to our{" "}
              <span style={{ color: GSOC_YELLOW }}>GSoC</span> 2026 achievers —
              a remarkable accomplishment for the community.
            </p>

            {/* Footer */}
            <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="relative flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ backgroundColor: PB_GREEN }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ backgroundColor: PB_GREEN }}
                />
              </span>
              <span className="font-mono text-[11px] tracking-wider text-white/70">
                POINT_BLANK
              </span>
            </div>
          </div>
        </div>

        {/* Outer halo */}
        <div className="pointer-events-none absolute -inset-3 rounded-[32px] bg-[#00c853]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </motion.div>
    </div>
  );
}

function StatBlock({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -2 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
    >
      {/* radiating rings — celebration emphasis */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: 80,
          height: 80,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(0,200,83,0.45)",
        }}
        animate={{ scale: [0.6, 1.6], opacity: [0.6, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeOut",
          delay,
        }}
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
        style={{
          width: 80,
          height: 80,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: "rgba(244,180,0,0.45)",
        }}
        animate={{ scale: [0.6, 1.9], opacity: [0.5, 0] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeOut",
          delay: delay + 0.6,
        }}
      />

      {/* base bottom-glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-12 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,200,83,0.6) 0%, rgba(0,200,83,0) 70%)",
        }}
      />

      <div className="relative flex items-baseline gap-2">
        <motion.span
          className="font-extrabold leading-none tabular-nums text-[44px]"
          style={{
            color: "#7CFFB2",
            textShadow:
              "0 0 18px rgba(0,200,83,0.55), 0 0 38px rgba(0,200,83,0.35)",
          }}
          animate={{
            textShadow: [
              "0 0 18px rgba(0,200,83,0.5), 0 0 38px rgba(0,200,83,0.3)",
              "0 0 26px rgba(0,200,83,0.85), 0 0 56px rgba(0,200,83,0.55)",
              "0 0 18px rgba(0,200,83,0.5), 0 0 38px rgba(0,200,83,0.3)",
            ],
          }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
        >
          {value}
        </motion.span>
        <span className="text-[13px] font-medium" style={{ color: "#7CFFB2" }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}
