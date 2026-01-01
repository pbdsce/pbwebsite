"use client";


import type { ReactNode } from "react";
import Carousel from "@/components/carousel.component";
import { cn } from "@/lib/server/utils";


interface ActivityCardProps {
 leftAligned: boolean;
 title: string;
 subtitle?: ReactNode;
 description: string;
 images?: string[];
}


export default function ActivityCard({
 leftAligned,
 title,
 subtitle,
 description,
 images,
}: ActivityCardProps) {
 return (
   <section className="w-full py-20 bg-neutral-950 overflow-hidden">
     <div
       className={cn(
         "grid grid-cols-1 lg:grid-cols-2 items-center",
         leftAligned && "lg:[&>*:first-child]:order-2"
       )}
     >
       {/* IMAGE — full-width, edge-adjacent */}
       <div className="relative w-full">
         <div className="relative aspect-[16/9] overflow-hidden pl-10 pr-10">
           <Carousel slides={images ?? []} />
         </div>   
       </div>


       {/* TEXT — constrained */}
       <div className="px-6 lg:px-20">
         <div className="max-w-xl lg:ml-10">
           <h3 className="text-6xl md:text-4xl font-semibold tracking-tight text-green-400 pr-10">
             {title}
           </h3>


           {subtitle && (
             <div className="mt-4 text-[30px] uppercase tracking-[0.55em] text-gray-500 pr-10">
               {subtitle}
             </div>
           )}


           <p className="mt-6 text-base md:text-xl leading-[1.8] text-gray-500 pr-10">
             {description}
           </p>
         </div>
       </div>
     </div>
   </section>
 );
}
