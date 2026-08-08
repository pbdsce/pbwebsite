"use client";

import type { ReactNode } from "react";
import OssAvatar from "@/components/oss/widgets/OssAvatar";
import type { ContributionPlatform } from "@/components/oss/types";

export default function OssFlipAvatar({
  login,
  name,
  platform,
  avatarUrl,
  size = 96,
  href,
  linkLabel,
  icon,
  flipped,
  onToggle,
}: {
  login?: string;
  name: string;
  platform?: ContributionPlatform;
  avatarUrl?: string;
  size?: number;
  href?: string;
  linkLabel: string;
  icon: ReactNode;
  flipped: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={flipped ? `Show ${name} avatar` : `Reveal link for ${name}`}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle();
        }
      }}
      className="relative shrink-0 cursor-pointer perspective-[1000px]"
      style={{ width: size, height: size }}
    >
      <div
        className="relative h-full w-full transform-3d transition-transform duration-500"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className={`absolute inset-0 backface-hidden ${flipped ? "pointer-events-none" : ""}`}
        >
          <OssAvatar
            login={login}
            name={name}
            platform={platform}
            avatarUrl={avatarUrl}
            shape="square"
            size={size}
          />
        </div>

        <div
          className={`absolute inset-0 flex items-center justify-center rounded-[10px] border border-pbborder bg-pbdarkgray backface-hidden ${!flipped ? "pointer-events-none" : ""}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={linkLabel}
              className="inline-flex items-center justify-center text-pbgreen transition-colors hover:text-white"
            >
              {icon}
            </a>
          ) : (
            icon
          )}
        </div>
      </div>
    </div>
  );
}
