"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { fireFromElement, useFire } from "./confetti";

export function BigStat({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const fire = useFire();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => fireFromElement(ref.current, fire, "burst")}
      onMouseEnter={() => fireFromElement(ref.current, fire, "pop")}
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative flex flex-col items-center justify-center cursor-pointer outline-none select-none"
      aria-label={`${value} ${label}`}
    >
      <motion.span
        className="relative font-extrabold leading-none tabular-nums"
        style={{
          fontSize: "clamp(88px, 17vw, 180px)",
          color: "#7CFFB2",
          textShadow:
            "0 0 30px rgba(0,200,83,0.6), 0 0 80px rgba(0,200,83,0.45)",
        }}
        animate={{
          textShadow: [
            "0 0 30px rgba(0,200,83,0.55), 0 0 80px rgba(0,200,83,0.4)",
            "0 0 56px rgba(0,200,83,0.95), 0 0 120px rgba(0,200,83,0.6)",
            "0 0 30px rgba(0,200,83,0.55), 0 0 80px rgba(0,200,83,0.4)",
          ],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
      >
        {value}
      </motion.span>
      <span
        className="relative mt-1 text-lg sm:text-2xl font-medium tracking-wide transition-colors duration-200 group-hover:text-white"
        style={{ color: "#7CFFB2" }}
      >
        {label}
      </span>
    </motion.button>
  );
}
