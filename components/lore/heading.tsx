"use client";
import React from "react";
import { motion } from "framer-motion";
// import logo from '@/public/images/logo.svg'
// import Image from 'next/image';

const Heading = () => {
  return (
    <div className="relative min-h-screen flex justify-center items-center overflow-hidden py-24 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-20 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-[#00c853] to-emerald-400 blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400 to-[#00c853] blur-3xl"></div>
      </div>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-5xl text-[#00c853] font-bold">
            {/* <Image src={logo.src} width={250} height={250} alt='PBLOGO'/>  */}
            {"<. >"}
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#00c853] to-emerald-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Our Lore
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Every line of code tells a story, but our greatest tales are written
          in the adventures we share. Here are the chronicles of our coding
          club&apos;s journeys, where friendship and innovation intertwine.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Heading;
