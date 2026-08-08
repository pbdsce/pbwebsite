"use client";

import { useState } from "react";
import type { ContributionPlatform } from "@/components/oss/types";

function initialsFor(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function OssAvatar({
  login,
  name,
  platform,
  avatarUrl,
  size = 32,
  shape = "circle",
  className = "",
}: {
  login?: string;
  name: string;
  platform?: ContributionPlatform;
  /** Explicit avatar URL, used as-is when provided (e.g. org avatars from the API). */
  avatarUrl?: string;
  size?: number;
  shape?: "circle" | "square";
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src =
    avatarUrl ||
    (login && platform !== "gitlab"
      ? `https://avatars.githubusercontent.com/${login}?size=${size * 2}`
      : undefined);
  const canLoadAvatar = Boolean(src) && !failed;
  const roundedClass = shape === "square" ? "rounded-[10px]" : "rounded-full";

  if (!canLoadAvatar) {
    return (
      <div
        className={`shrink-0 ${roundedClass} border border-zinc-800 bg-pbgray flex items-center justify-center font-semibold text-zinc-400 ${className}`}
        style={{ width: size, height: size, fontSize: Math.max(9, size * 0.34) }}
      >
        {initialsFor(name)}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={`${name}'s avatar`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`shrink-0 ${roundedClass} border border-zinc-800 object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
