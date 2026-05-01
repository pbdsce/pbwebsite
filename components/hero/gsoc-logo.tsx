"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsocLogoSrc from "@/public/images/gsoc-sun.svg";
import { GSOC_YELLOW } from "./constants";
import { fireFromElement, useFire } from "./confetti";

export function GsocLogo({ size = 96 }: { size?: number }) {
  const fire = useFire();
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => fireFromElement(ref.current, fire, "burst")}
      animate={{ rotate: [0, 4, -4, 0], y: [0, -3, 0, 3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.1, rotate: 0 }}
      whileTap={{ scale: 0.94 }}
      style={{ width: size, height: size }}
      className="relative shrink-0 cursor-pointer outline-none"
      aria-label="Celebrate GSoC"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${GSOC_YELLOW}aa 0%, ${GSOC_YELLOW}00 65%)`,
          filter: "blur(16px)",
          transform: "scale(1.2)",
        }}
      />
      <Image
        src={gsocLogoSrc}
        alt="Google Summer of Code"
        width={size}
        height={size}
        priority
        className="relative h-full w-full select-none"
      />
    </motion.button>
  );
}
