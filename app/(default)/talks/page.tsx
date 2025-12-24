"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TalkCard from "@/components/TalkCard";

const TALKS_DATA = [
  {
    id: "talk-1",
    name: "Akash Singh",
    title: "The Future of Open Source",
    conference: "DevConf '24",
    location: "@Keploy",
    description:
      "An exploration into how student-led open source initiatives are shaping the next generation of developer tools.",
    type: "Conferences",
    link: "https://blog.pointblank.club/open-source-future",
  },
  {
    id: "talk-2",
    name: "Rahul Jagwani",
    title: "Scaling Community Tech",
    conference: "GSoC '23",
    location: "@BMI",
    description:
      "Sharing the technical hurdles and triumphs of building a platform that supports thousands of concurrent users for events.",
    type: "Talks",
    link: "https://blog.pointblank.club/scaling-community",
  },
];

export default function TalksPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [isInitialRender, setIsInitialRender] = useState(true);

  // FIX: Stable timer to prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialRender(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const filteredTalks = useMemo(() => {
    return activeCategory === "All"
      ? TALKS_DATA
      : TALKS_DATA.filter((talk) => talk.type === activeCategory);
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col font-sans overflow-x-hidden">

      {/* 1. THE PERMANENT FIX FOR MINGLING: 
          This is a physical block that clears the wrapped header rows.
          We use a hard pixel height because your header is 'fixed'.
      */}
      <div
        className="w-full h-[220px] md:h-[280px] flex-shrink-0"
        aria-hidden="true"
      />

      {/* Background Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto pb-20 px-6 relative z-10 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <header className="relative mb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase"
          >
            We Speak. We Share. We Lead.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-zinc-500 mt-6 italic"
          >
            A showcase of talks and conferences by the talented members of
            PointBlank
          </motion.p>
        </header>

        {/* CATEGORY FILTERS */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {["All", "Conferences", "Talks"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-[#00C853] text-black shadow-[0_0_25px_rgba(0,200,83,0.5)] scale-105"
                  : "bg-zinc-900/80 text-zinc-500 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* TALKS GRID: Using popLayout to prevent the 500 error/Stack overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          <AnimatePresence mode="popLayout">
            {filteredTalks.map((talk, idx) => (
              <motion.div
                key={talk.id} // Unique ID prevents console error
                layout
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: isInitialRender ? idx * 0.1 : 0,
                }}
              >
                <TalkCard talk={talk} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
