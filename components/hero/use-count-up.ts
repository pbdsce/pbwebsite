"use client";

import { useEffect, useState } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export function useCountUp(target: number, duration = 1.8, delay = 0.4) {
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
