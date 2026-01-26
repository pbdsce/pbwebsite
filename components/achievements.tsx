"use client";
import React, { useEffect, useState, useMemo } from "react";
import Marquee from "@/components/magicui/marquee";
import { apiFetch } from "@/lib/apiFetch";
import LoadingBrackets from "@/components/ui/loading-brackets";
import { AchievementTile, TileData } from "@/components/AchievementTiles";
interface Achievement {
  title: string;
  description: string;
  _id?: string;
}

interface Achiever {
  id: string;
  imageUrl?: string;
  name: string;
  achievements: {
    GSoC?: Achievement[];
    LFX?: Achievement[];
    SIH?: Achievement[];
    LIFT?: Achievement[];
    Hackathons?: Achievement[];
    CP?: Achievement[];
    ACM?: Achievement[];
    [key: string]: Achievement[] | undefined;
  };
}


const CATEGORY_CONFIG: Record<string, { img: string; username: string }> = {
  GSoC: { img: "gsoclogo.webp", username: "@GSOC" },
  LFX: { img: "lfxlogo.webp", username: "@LFX" },
  SIH: { img: "sihlogo.webp", username: "@SIH" },
  LIFT: { img: "lfxlogo.webp", username: "@LIFT" },
  CP: { img: "icpclogo.webp", username: "@CP" },
  ACM: { img: "acm.webp", username: "@ACM" },
  HackathonFallback: { img: "pointblank.webp", username: "@Hackathon" },
  CPFallback: { img: "pointblank.webp", username: "@CP" },
  "ACM ICPC": { img: "icpclogo.webp", username: "@ICPC" },
  "HackGlobal Singapore": { img: "hackglobal.webp", username: "@Hackathon" },
  "NITK '25": { img: "nitklogo.webp", username: "@Hackathon" },
  "Aegis Sandbox": { img: "Aegis.webp", username: "@Hackathon" },
  "Innerve 9.0": { img: "innerve.webp", username: "@Hackathon" },
  "Aventus 3.0": { img: "aventus.webp", username: "@Hackathon" },
  "SentinelHack 2025": { img: "sentinalhack.webp", username: "@Hackathon" },
  "HackToFuture by St. Josephs": { img: "htf.webp", username: "@Hackathon" },
  "HackNocturne by SMVIT": { img: "hacknocturne.webp", username: "@Hackathon" },
  "Centuriton": { img: "centuriton.webp", username: "@Hackathon" },
  "Genesys Hackathon by PES": { img: "genesys.webp", username: "@Hackathon" },
};

function Achievements() {
  const [achievers, setAchievers] = useState<Achiever[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAchievers = async () => {
      try {
        const response = await apiFetch("/api/achievements-category");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (isMounted) setAchievers(data.data);
      } catch (error) {
        console.error("Failed to fetch achievements:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchAchievers();
    return () => { isMounted = false; };
  }, []);

  const rows = useMemo(() => {
    if (achievers.length === 0) return { firstRow: [], secondRow: [], fDuration: 0, sDuration: 0 };

    const transformed: TileData[] = achievers.flatMap((achiever) => 
      Object.entries(achiever.achievements || {}).flatMap(([category, achievements]) => {
        if (!Array.isArray(achievements)) return [];
        
        return achievements.map((ach, index) => {
          let config = CATEGORY_CONFIG[category];
          if (category === "Hackathons") config = CATEGORY_CONFIG[ach.title] || CATEGORY_CONFIG["HackathonFallback"];
          if (category === "CP") config = CATEGORY_CONFIG[ach.title] || CATEGORY_CONFIG["CPFallback"];

          return config ? {
            id: `${achiever.id}-${category}-${index}`,
            name: achiever.name,
            username: config.username,
            title: ach.title,
            description: ach.description,
            img: config.img,
          } : null;
        }).filter(Boolean) as TileData[];
      })
    );

    // Shuffle and Split
    const shuffled = transformed.sort(() => Math.random() - 0.5);
    const splitPoint = Math.ceil(shuffled.length / 2);
    const fRow = shuffled.slice(0, splitPoint);
    const sRow = shuffled.slice(splitPoint);
    const speedFactor = 6;

    return {
      firstRow: fRow,
      secondRow: sRow,
      fDuration: fRow.length * speedFactor,
      sDuration: sRow.length * speedFactor
    };
  }, [achievers]);


return (
  <>
    <style>
      {`
        @keyframes blinker {
          to { opacity: 0; }
        }

        div[style*="overflow-x-auto"]::-webkit-scrollbar {
          display: none !important;
        }

        div[style*="overflow-x-auto"] {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
    </style>

    <div className="py-10 select-none">
      {/* Heading is always visible */}
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-3xl sm:text-4xl text-center font-black text-white">
          Achievements
        </h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh] md:min-h-[60vh]">
          <LoadingBrackets />
        </div>
      ) : (
        <div className="relative flex flex-col gap-4 md:gap-6 lg:gap-8">
          <Marquee
            pauseOnHover
            style={{ "--duration": `${rows.fDuration}s` } as React.CSSProperties}
          >
            {rows.firstRow.map((item) => (
              <AchievementTile key={item.id} {...item} />
            ))}
          </Marquee>

          <Marquee
            reverse
            pauseOnHover
            style={{ "--duration": `${rows.sDuration}s` } as React.CSSProperties}
          >
            {rows.secondRow.map((item) => (
              <AchievementTile key={item.id} {...item} />
            ))}
          </Marquee>
        </div>
      )}
    </div>
  </>
);
}
export default Achievements;
