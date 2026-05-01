"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import confetti from "canvas-confetti";
import { GOLD_PALETTE } from "./constants";

export type FireFn = (
  origin: { x: number; y: number },
  kind?: "burst" | "pop"
) => void;

const ConfettiCtx = createContext<FireFn | null>(null);

export const useFire = () => useContext(ConfettiCtx);

export function fireFromElement(
  el: HTMLElement | null,
  fire: FireFn | null,
  kind: "burst" | "pop" = "burst"
) {
  if (!el || !fire) return;
  const rect = el.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;
  fire({ x, y }, kind);
}

export function ConfettiProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireRef = useRef<((opts: confetti.Options) => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const myConfetti = confetti.create(canvas, {
      resize: true,
      useWorker: true,
    });
    fireRef.current = myConfetti as unknown as (opts: confetti.Options) => void;

    let cancelled = false;

    myConfetti({
      particleCount: 220,
      spread: 110,
      startVelocity: 55,
      decay: 0.92,
      gravity: 0.85,
      ticks: 280,
      origin: { x: 0.5, y: 0.65 },
      colors: GOLD_PALETTE,
      scalar: 1.25,
      shapes: ["square", "circle"],
    });
    setTimeout(() => {
      if (cancelled) return;
      myConfetti({
        particleCount: 90,
        angle: 60,
        spread: 60,
        startVelocity: 55,
        origin: { x: 0, y: 0.85 },
        colors: GOLD_PALETTE,
        scalar: 1.2,
      });
      myConfetti({
        particleCount: 90,
        angle: 120,
        spread: 60,
        startVelocity: 55,
        origin: { x: 1, y: 0.85 },
        colors: GOLD_PALETTE,
        scalar: 1.2,
      });
    }, 250);

    const rain = setInterval(() => {
      if (cancelled) return;
      myConfetti({
        particleCount: 4,
        angle: 90,
        spread: 80,
        startVelocity: 18,
        gravity: 0.55,
        drift: (Math.random() - 0.5) * 1.6,
        ticks: 380,
        origin: { x: Math.random(), y: -0.06 },
        colors: GOLD_PALETTE,
        shapes: ["square", "circle"],
        scalar: 0.9 + Math.random() * 0.6,
      });
    }, 130);

    return () => {
      cancelled = true;
      clearInterval(rain);
      myConfetti.reset();
      fireRef.current = null;
    };
  }, []);

  const fire = useCallback<FireFn>((origin, kind = "burst") => {
    const fn = fireRef.current;
    if (!fn) return;
    if (kind === "burst") {
      fn({
        particleCount: 120,
        spread: 90,
        startVelocity: 45,
        gravity: 0.85,
        ticks: 260,
        origin,
        colors: GOLD_PALETTE,
        scalar: 1.2,
        shapes: ["square", "circle"],
      });
      fn({
        particleCount: 60,
        spread: 360,
        startVelocity: 22,
        gravity: 0.7,
        ticks: 220,
        origin,
        colors: GOLD_PALETTE,
        scalar: 0.9,
      });
    } else {
      fn({
        particleCount: 50,
        spread: 70,
        startVelocity: 30,
        gravity: 0.85,
        ticks: 200,
        origin,
        colors: GOLD_PALETTE,
        scalar: 1,
      });
    }
  }, []);

  return (
    <ConfettiCtx.Provider value={fire}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
        aria-hidden
      />
      {children}
    </ConfettiCtx.Provider>
  );
}
