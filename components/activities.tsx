
"use client";


import type { ReactNode } from "react";
import ActivityCard from "./ActivityCard";


interface Activity {
 title: string;
 subtitle?: string | ReactNode;
 description: string;
 images: string[];
}


const activities: Activity[] = [
 {
   title: "CP Contests",
   subtitle: "PB Hustle",
   images: ["/images/cp.webp", "/images/pbhustle1.webp", "/images/pbhustle2.webp"],
   description:
     "Since 2019, Point Blank has built a strong competitive programming culture. Participation scaled rapidly, with teams qualifying for ICPC Regionals and achieving strong global finishes. PB Hustle is our weekly open contest with over 100 editions.",
 },
 {
   title: "Development",
   subtitle: "PB Chronicles",
   images: ["/images/dev.webp", "/images/dev1.webp", "/images/dev2.webp"],
   description:
     "We host hands-on workshops across web, mobile, DevOps, machine learning, and open source — focused on real skills rather than slides.",
 },
 {
   title: "Hackathons",
   subtitle: "Smart India Hackathon",
   images: ["/images/hack.webp", "/images/SIH_2024.webp", "/images/SIH_2025_1.JPG"],
   description:
     "Point Blank organizes the internal Smart India Hackathon annually, with consistent national qualifications, finals, and wins.",
 },
 {
   title: "Open Source",
   subtitle: "Google Summer of Code",
   images: ["/images/gsocact.webp", "/images/LFX.webp", "/images/githubExtern.webp"],
   description:
     "Our open-source community has produced GSOC contributors, LFX scholars, and GitHub Externs across global organizations.",
 },
 {
   title: "Cybersecurity",
   subtitle: "PBCTF",
   images: ["/images/ctf4.webp", "/images/ctf1.webp", "/images/ctf2.webp", "/images/ctf3.webp"],
   description:
     "We run hands-on cybersecurity sessions and host PBCTF, an in-house Capture The Flag event with wide campus participation.",
 },
];


export default function Activities() {
 return (
   <section className="bg-[#0b0b0b]">
     {/* HEADER */}
     <div className="mx-auto max-w-7xl px-6 pt-28 pb-16 text-center">
       <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
         Activities
       </h2>
     </div>


     {/* LIST */}
     {activities.map((activity, index) => (
       <ActivityCard
         key={activity.title}
         title={activity.title}
         subtitle={activity.subtitle}
         description={activity.description}
         images={activity.images}
         leftAligned={index % 2 === 0}
       />
     ))}
   </section>
 );
}
