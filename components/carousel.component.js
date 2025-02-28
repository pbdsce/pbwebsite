"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/server/utils";

import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";
export default function Carousel({ slides, useScrollHoverEffects = false, className = ''}) {
  let [current, setCurrent] = useState(0);

  let previousSlide = () => {
    if (current === 0) setCurrent(slides.length - 1);
    else setCurrent(current - 1);
  };

  let nextSlide = () => {
    if (current === slides.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  useEffect(() => {
    if (!useScrollHoverEffects) return; 

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); 

    return () => clearInterval(interval); 
  }, [useScrollHoverEffects, current]);

  return (
    <div className={cn("overflow-hidden relative", 
    useScrollHoverEffects && "rounded-xl h-64 ")}>
      <div
        className={`flex transition ease-out duration-1000`}
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {slides.map((s, idx) => {
          return <div className="relative w-full h-full flex-shrink-0">
  <Image 
    src={s} 
    alt={`Slide ${idx}`} 
    layout="responsive" 
    width={500} 
    height={300} 
    className={cn("object-contain w-full h-full", useScrollHoverEffects ? "object-contain" : "object-cover")}
  />
</div>;

        })}
      </div>

      <div className={cn("absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl", 
        useScrollHoverEffects && "opacity-0 px-3 hover:opacity-40 transition-opacity duration-300")}>
        <button onClick={previousSlide}>
          <BsFillArrowLeftCircleFill />
        </button>
        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      <div className="absolute bottom-0 py-4 flex justify-center gap-3 w-full">
        {slides.map((s, i) => {
          return (
            <div
              onClick={() => {
                setCurrent(i);
              }}
              key={"circle" + i}
              className={cn(
                "rounded-full cursor-pointer", 
                i == current ? "bg-white" : "bg-gray-500", 
                useScrollHoverEffects ? "w-2 h-2 opacity-50" : "w-5 h-5" 
              )}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
