"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/server/utils";

/**
 * @param {Object} props
 * @param {string[]} [props.slides]
 * @param {string} [props.className]
 */

export default function Carousel({ slides = [], className = "" }) {
 const images = Array.isArray(slides) ? slides : [];
 const [index, setIndex] = useState(0);

const goToPrevious = () => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

const goToNext = () => {
    setIndex((i) => (i + 1) % images.length);
  };


 useEffect(() => {
   if (images.length <= 1) return;


   const id = setInterval(() => {
     setIndex((i) => (i + 1) % images.length);
   }, 4500);


   return () => clearInterval(id);
 }, [images.length]);


 if (images.length === 0) {
   return <div className={cn("h-full w-full bg-neutral-900", className)} />;
 }


 return (
   <div className={cn("relative h-full w-full", className)}>
     {/* FRAME */}
     <div className="relative h-full w-full overflow-hidden rounded-xl">
       {/* SLIDER */}
       <div
         className="flex h-full transition-transform duration-700 ease-in-out"
         style={{ transform: `translateX(-${index * 100}%)` }}
       >
         {images.map((src, i) => (
           <div key={i} className="relative h-full w-full flex-shrink-0">
             <Image
               src={src}
               alt=""
               fill
               className="object-cover"
               priority={i === 0}
             />
           </div>
         ))}
       </div>
              {/* LEFT ARROW */}
        {images.length > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full p-2 transition"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* RIGHT ARROW */}
        {images.length > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur rounded-full p-2 transition"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}


       {/* DOTS — TRUE CENTER */}
       {images.length > 1 && (
         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-2 rounded-full bg-black/40 backdrop-blur">
           {images.map((_, i) => (
             <button
               key={i}
               onClick={() => setIndex(i)}
               className={cn(
                 "h-2 w-2 rounded-full transition",
                 i === index ? "bg-white" : "bg-white/40"
               )}
             />
           ))}
         </div>
       )}
     </div>
   </div>
 );
}
