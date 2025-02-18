"use client";

import React from "react";
import { cn } from "@/lib/server/utils";
import Marquee from "@/components/magicui/marquee";
import { achievementJson } from "./achievementList";
import Image from 'next/image'
import Link from "next/link";
import { motion } from "framer-motion";

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
        <Image className="rounded-full" width={38} height={38} alt="" src={`/images/${img}`} />
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
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 2, delay: 0.5 }}
      className="pt-24">
      <div className="container place-items-center font-bold pb-6">
        <h2 className="text-3xl sm:text-6xl text-white-800 text-center font-black">
          Achievements
        </h2>
      </div>
      <Marquee pauseOnHover className="[--duration:60s]">
        {firstRow.map((section, index) => (
          <Tile key={`firstRow-${index}`} {...section} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:60s]">
        {secondRow.map((section, index) => (
          <Tile key={`secondRow-${index}`} {...section} />
        ))}
      </Marquee>
      <Marquee pauseOnHover className="[--duration:60s]">
        {secondRow.map((section, index) => (
          <Tile key={`firstRow-${index}`} {...section} />
        ))}
      </Marquee>
      <div className="flex justify-center pt-20"> 
        <Link href="/achievements">
        <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-sm sm:text-xl font-semibold leading-6  text-white inline-block">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-5 sm:py-5 sm:px-10 ring-1 ring-white/10 ">
            <span>
              More Achievements
            </span>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
        </Link>
      </div> 
    </motion.div>
    </>
  );
}
export default Achievements;

