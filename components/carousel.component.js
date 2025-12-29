"use client";


import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/server/utils";


export default function Carousel({ slides = [], className = "" }) {
 const images = Array.isArray(slides) ? slides : [];
 const [index, setIndex] = useState(0);


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
