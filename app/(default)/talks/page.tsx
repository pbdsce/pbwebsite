"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TalkCard from "@/components/TalkCard";
type Category = "All" | "Conferences" | "Talks";
const CATEGORY_DESCRIPTIONS = {
  All: "A showcase of talks and conferences by the talented members of Point Blank.",
  Conferences:
    "Our members representing Point Blank on global stages and major tech summits.",
  Talks:
    "Internal deep-dives, community workshops, and technical sharing sessions.",
};
const TALKS_DATA = [
  {
    id: "talk-1",
    name: "PB Team",
    title: "Front row to open source innovation",
    date: "1st January 2025",
    conference: "IndiaFOSS 2025",
    location: "@DSCE",
    description:
      "Point Blank juniors had the incredible opportunity to volunteer at FOSS United’s IndiaFOSS, one of India’s largest open-source tech conferences. They observed real-time operations, interacted with open-source leaders, and gained valuable insights from mentors like Dr. Kailash Nadh and Chad Whitacre. This hands-on experience strengthened Point Blank’s vision of building impactful open-source communities and inspired juniors to imagine and organize meaningful tech events of their own.",
    type: "Talks",
  },
  {
    id: "talk-2",
    name: "Ashutosh Pandey",
    title: "Innovations in Compiler Technology (IICT) Workshop",
    date: "1st January 2025",
    conference: "IICT",
    location: "@IISc Bangalore",
    description:
      "The IICT workshop, hosted at IISc Bangalore on 28–29 September 2025, brought together researchers and practitioners in compiler technologies. Point Blank actively volunteered in executing the event - supporting coordination, assisting speakers, and ensuring smooth operations throughout the workshop. Their contribution added to the event’s success while exposing juniors to cutting-edge research and real-world tech collaboration.",
    type: "Conferences",
  },
];

export default function TalksPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [selectedTalk, setSelectedTalk] = useState<any | null>(null);

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
      <div
        className="w-full h-[220px] md:h-[280px] flex-shrink-0"
        aria-hidden="true"
      />

      <div className="fixed top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto pb-20 px-6 relative z-10 w-full flex flex-col items-center">
        <header className="relative mb-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter uppercase"
          >
            We Speak. We Share. We Lead.
          </motion.h1>
          <motion.p
            key={activeCategory} // Adding a key makes the text animate when it changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg md:text-xl text-zinc-500 mt-6 italic"
          >
            {CATEGORY_DESCRIPTIONS[activeCategory]}
          </motion.p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {(["All", "Conferences", "Talks"] as Category[]).map((cat) => (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          <AnimatePresence mode="popLayout">
            {filteredTalks.map((talk, idx) => (
              <motion.div
                key={talk.id}
                layout
                onClick={() => setSelectedTalk(talk)}
                className="cursor-pointer"
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
      <AnimatePresence>
        {selectedTalk && (
          <>
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTalk(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />

            {/* Side Panel Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-zinc-950 border-l border-zinc-800 z-[101] p-8 overflow-y-auto"
            >
              <button
                onClick={() => setSelectedTalk(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white text-xl"
              >
                ✕
              </button>

              <div className="mt-12 flex flex-col h-full">
                <p className="text-[#00C853] font-bold text-xs uppercase tracking-widest mb-2">
                  {selectedTalk.type}
                </p>
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  {selectedTalk.title}
                </h2>
                <div className="mt-4 text-zinc-400 font-medium flex items-center gap-2">
                  <span>{selectedTalk.name}</span>
                  <span>•</span>
                  <span>{selectedTalk.conference}</span>
                  <span>•</span>
                  <span className="text-[#00C853]">{selectedTalk.date}</span>
                </div>
                <div className="mt-10 space-y-8 flex-grow">
                  <div>
                    <h4 className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mb-2">
                      Location
                    </h4>
                    <p className="text-lg text-zinc-200">
                      {selectedTalk.location}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-zinc-500 uppercase text-[10px] font-bold tracking-widest mb-2">
                      Description
                    </h4>
                    <p className="text-zinc-300 leading-relaxed">
                      {selectedTalk.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
