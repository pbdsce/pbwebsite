"use client";

import React from "react";
import { cn } from "@/lib/server/utils";
import Marquee from "@/components/magicui/marquee";
import { achievementJson } from "./achievementList";
import Image from 'next/image'
import { convertToWebP } from "@/utils/webpImages";

const Tile = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width={38} height={38} alt="" src={convertToWebP(`/images/${img}`)} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

function Achievements() {
  const firstRow = achievementJson.slice(0, achievementJson.length / 2);
  const secondRow = achievementJson.slice(achievementJson.length / 2);
  return (
    <>
      <div className="container place-items-center font-bold pb-5">
        <h2 className="text-3xl sm:text-4xl text-white-800 text-center font-black">
          Achievements
        </h2>
      </div>
      <Marquee pauseOnHover className="[--duration:80s]">
        {firstRow.map((section) => (
          <Tile key={section.id} {...section} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:80s]">
        {secondRow.map((section) => (
          <Tile key={section.id} {...section} />
        ))}
      </Marquee>
    </>
  );
}
export default Achievements;

