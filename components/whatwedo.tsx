"use client";
import Image from "next/image";
import logo from "@/public/images/alien.webp";
import { motion } from "framer-motion";

export default function WhatWeDo() {
  return (
    <section className="min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <motion.h2
              initial={{ opacity: 0, y: -40 }}
              whileInView={{type: "spring", opacity: 1, y: 0}}
              transition={{ delay: 0.5 }}
              className="text-2xl sm:text-4xl font-black mb-1 mt-2 sm:mb-4 sm:mt-0">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-[#00c853]">Mission</span>, together.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{type: "spring", opacity: 1, y: 0}}
              transition={{ delay: 0.5 }}
              className="text-gray-200 text-sm sm:text-xl leading-relaxed mb-6">
            <p>
              In Point Blank, we believe in the concept of no spoon-feeding. We are here to help you learn and grow together. We are a community of coders, hackers, developers, and tech enthusiasts passionate about technology and learning.
            </p>
            {/* List of Values */}
            <div className="text-left">
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">1</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Connect with other coders</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Have a coding question? Looking for project feedback? Just hit the Pseudorandom group chat.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">2</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Want to learn something new?</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    We have a variety of people willing to help you learn new things. Dont just ask how to get started, ask what to do next.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">3</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Feeling bored?</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    We are not just about coding. We are also a group of friends who love to play games, going out on trips, and having fun.
                  </p>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
          
          {/* Right Column with Image */}
          <motion.div 
            drag
            dragSnapToOrigin
            dragElastic={0.8}
            whileDrag={{zIndex:99}}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{type: "spring", opacity: 1, x: 0}}
            transition={{ 
              type: "spring", 
              
            }}
            className="lg:w-1/2 flex justify-left lg:justify-end">
            <Image src={logo} alt="Logo" width={300} height={300} className="shadow-lg rounded-lg" unoptimized />
          </motion.div>
        </div>
      </div>
    </section>
  );
}