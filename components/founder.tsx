'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';
import { DirectionAwareHover } from './ui/direction-aware-hover';

export default function Teams() {
  const teamData = [
    {
      url: '/images/founder1.png',
      name: "Mohit Agarwal",
      description: "Mohit, SDE2 at Glance, is the driving force behind Point Blank's Competitive Programming culture. He has won several contests, including the Nokia Collegiate Code Rally, and qualified for ACM-ICPC Regionals."
    },
    {
      url: '/images/founder2.png',
      name: "Soumya Pattanayak",
      description: "A top coder at DSCE, Soumya has worked at Amazon and Verse Innovation. He's an ACM-ICPC regionalist known for his problem-solving skills and innovative projects."
    },
    {
      url: '/images/founder3.jpg',
      name: "Ashutosh Pandey",
      description: "Ashutosh, Compiler Engineer at AMD, excelled in Open Source and Hackathons. As a student, he did GSoC with Arduino, won the Smart India Hackathon, and mentored students for prestigious programs."
    }
  ];

  return (
    <section className="relative min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 md:px-12 xl:px-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16 text-center"
          >
            <div className="font-bold pt-14 md:pt-20 pb-4">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl sm:text-3xl text-center text-green-500 font-black"
              >
                Our Founding Members
              </motion.h2>
            </div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-300 text-base sm:text-lg lg:w-7/12 lg:mx-auto"
            >
              Point Blank started as a project by three friends who wanted to induce a change by providing a platform for like-minded, smart students to come together and learn from each other.
            </motion.p>
          </motion.div>
          <div className="flex flex-col md:flex-row gap-9 md:gap-4 lg:gap-0 justify-center">
            {teamData.map((member, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="flex-1 space-y-3 text-center"
              >
                <DirectionAwareHover
                  className="sm:w-64 sm:h-64 mx-auto object-cover rounded-xl"
                  src={member.url}
                >
                  <p className="text-lg sm:text-xl font-bold">{member.name}</p>
                  <p className="text-gray-300 text-sm sm:text-base md:px-6 lg:px-10">
                    {member.description}
                  </p>
                </DirectionAwareHover>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}