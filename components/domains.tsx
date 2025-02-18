'use client';
import { HoverEffect } from "./ui/card-hover-effect";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";

const domains = [
  {
    title: "ACM - ICPC",
    img: "https://icpc.global/regionals/abouticpc/foundationlogo.png",
  },
  {
    title: "Kaggle",
    img: "https://img.icons8.com/?size=100&id=Omk4fWoSmCHm&format=png&color=000000",
  },
  {
    title: "IOT-ML",
    img: "https://img.icons8.com/?size=100&id=Ih6zOUuHwOOs&format=png&color=000000",
  },
  {
    title: "ML-Research",
    img: "https://img.icons8.com/?size=100&id=114322&format=png&color=000000",
  },
  {
    title: "DevOps",
    img: "https://img.icons8.com/?size=100&id=13816&format=png&color=000000",
  },
  {
    title: "Flutter Development",
    img: "https://img.icons8.com/?size=100&id=7I3BjCqe9rjG&format=png&color=000000",
  },
  {
    title: "React Development",
    img: "https://img.icons8.com/?size=100&id=123603&format=png&color=000000",
  },
  {
    title: "Open Source Hackathon",
    img: "https://img.icons8.com/?size=100&id=63655&format=png&color=000000",
  },
  {
    title: "Cyber-Security",
    img: "https://img.icons8.com/fluency-systems-filled/50/FFFFFF/web-shield.png",
  },
  {
    title: "Elitism",
    img: "https://img.icons8.com/external-goofy-flat-kerismaker/96/external-Moai-landmark-monument-goofy-flat-kerismaker.png",
  },
];

export default function Domains() {
  return (
    <div className="relative min-h-screen pt-20 overflow-hidden sm:mb-0 mb-10">
      <motion.div
      initial={{ opacity: 0, y: -40 }}
      whileInView={{type: "spring", opacity: 1, y: 0}}
      transition={{ delay: 0.2 }}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-gray-200 m-5 sm:m-4 ">
        Domains we ❤️
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-center text-gray-100 mb-6 sm:mb-8 px-2">
        Our club covers a wide range of interests and fields, bringing unique perspectives and expertise to every project!
      </p>
      </motion.div>

      <div className="overflow-y-auto">
        <HoverEffect items={domains} />
      </div>
    </div>
  );
}