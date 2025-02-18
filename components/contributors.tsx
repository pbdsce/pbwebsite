'use client';
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ContributorCard from './ContributorCard'

const Contributors = () => {
  return (
    <div className="relative snap-start min-h-screen w-full lg:pt-10">
          <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-center">
            <h1 className="text-3xl sm:text-[4rem] font-extrabold text-gray-100 pt-20">
              Website <span className="text-green-500">Contributors</span>
            </h1>
          </motion.div>
          <div className="relative z-10">
            <ContributorCard/>
          </div>

          {/* Add gradient overlay */}
          {/* <motion.div 
          initial={{ opacity: 0}}
            whileInView={{ opacity: 0.6}}
            transition={{duration: 5}}
          className="absolute z-20 h-64 bottom-0 bg-gradient-to-t from-slate-300 to-transparent w-full"></motion.div> */}

          <div className="flex md:flex-row flex-col justify-center items-center">
          <Link href="/Credits">
        <button className="bg-slate-800 z-30 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-sm sm:text-xl font-semibold leading-6  text-white inline-block mb-10">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-5 sm:py-5 sm:px-10 ring-1 ring-white/10 ">
            <span>
              More Contributors
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
        </div>
  )
}

export default Contributors;