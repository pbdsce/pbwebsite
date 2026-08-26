"use client";

import { Lexend_Tera } from "next/font/google";
import ThreeBackground from "@/components/ui/ThreeBackground";
import { motion } from "framer-motion";
import SihBanner from "@/components/ui/SihBanner";
import Recruitment from "@/components/ui/Recruitment";

const lexendTera = Lexend_Tera({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const headingParts = [
  {
    text: "We Are ",
    className:
      "bg-linear-to-b px-1.5 from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent font-semibold",
  },
  { text: " <. >", className: "text-pbgreen font-semibold font-mono" },
  { br: true },
  { text: " Point ", className: "text-pbgreen font-semibold" },
  {
    text: "Blank",
    className:
      "font-semibold px-1.5 bg-linear-to-b from-[#FFFFFF] to-[#999999] bg-clip-text text-transparent",
  },
  {
    text: "Student run Open Source Community from India",
    className: "text-base text-white italic pt-2",
    block: true,
  },
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative z-10 min-h-[90vh] overflow-hidden text-white bg-pbpages"
    >
      <Recruitment />
      <ThreeBackground />
      <div className="relative z-10 min-h-[90vh] flex items-center px-4 sm:px-10 lg:px-24 py-28 lg:py-20 max-w-420 mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center w-full">
          <div className="col-span-1 lg:col-span-7 flex flex-col items-center lg:items-start">
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-center lg:text-left tracking-[-22%] text-white select-none ${lexendTera.className}`}
            >
              {headingParts.map((part, idx) =>
                part.br ? (
                  <br key={idx} />
                ) : (
                  <motion.span
                    key={idx}
                    className={part.className}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    style={{ display: part.block ? "block" : "inline" }}
                  >
                    {part.text}
                  </motion.span>
                ),
              )}
            </h1>
          </div>
          <div className="col-span-1 lg:col-span-5 flex justify-center lg:justify-end w-full">
            <SihBanner />
          </div>
        </div>
      </div>
    </section>
  );
}
