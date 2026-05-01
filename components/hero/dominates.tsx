"use client";

import { motion } from "framer-motion";
import { GSOC_LIGHT } from "./constants";

export function Dominates() {
  return (
    <motion.span
      className="inline-block italic pr-[0.15em]"
      initial={{ opacity: 0, y: 6 }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundPositionX: ["0%", "200%"],
      }}
      transition={{
        opacity: { delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        y: { delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
        backgroundPositionX: {
          duration: 5.5,
          repeat: Infinity,
          ease: "linear",
          delay: 1.2,
        },
      }}
      style={{
        backgroundImage: `linear-gradient(110deg, #ffffff 0%, #ffffff 42%, ${GSOC_LIGHT} 50%, #ffffff 58%, #ffffff 100%)`,
        backgroundSize: "200% 100%",
        backgroundRepeat: "repeat",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      dominates
    </motion.span>
  );
}
