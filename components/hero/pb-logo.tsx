"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { PB_GREEN, PB_WHITE } from "./constants";
import { fireFromElement, useFire } from "./confetti";

export function PBLogo({ height }: { height: number }) {
  const fire = useFire();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => fireFromElement(ref.current, fire, "burst")}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="relative inline-flex items-baseline align-middle cursor-pointer outline-none font-extrabold"
      style={{ fontSize: height, lineHeight: 1, letterSpacing: "-0.01em" }}
      aria-label="Point Blank"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 50%, rgba(0,200,83,0.45) 0%, rgba(0,200,83,0) 70%)",
          filter: "blur(14px)",
          transform: "scale(1.1)",
        }}
      />
      <span className="relative" style={{ color: PB_GREEN }}>
        Point
      </span>
      <span className="relative ml-[0.28em]" style={{ color: PB_WHITE }}>
        Blank
      </span>
    </motion.button>
  );
}
