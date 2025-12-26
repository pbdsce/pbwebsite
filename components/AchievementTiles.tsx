import React from "react";
import Image from 'next/image';
import { cn } from "@/lib/server/utils";
import { convertToWebP } from "@/utils/webpImages";

export interface TileData {
  id: string;
  name: string;
  username: string;
  title: string;
  description: string;
  img: string;
}

export const AchievementTile = ({ img, name, username, title, description }: TileData) => {
  return (
    <figure className={cn(
      "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
      "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
      "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
    )}>
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          width={38}
          height={38}
          alt={name}
          src={convertToWebP(`/images/${img}`)}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <div className="mt-2 text-sm">
        <p className="font-semibold dark:text-white line-clamp-1">{title}</p>
        <p className="text-gray-500 dark:text-gray-400 line-clamp-1">{description}</p>
      </div>
    </figure>
  );
};
