export const metadata = {
  title: "Point Blank",
  description: "Point Blank is a student-run tech community at Dayananda Sagar College of Engineering, Bangalore. We are a group of tech enthusiasts who love to learn and grow together.",
};

// Define the viewport settings separately
export const viewport = {
  initialScale: 1,
  width: 'device-width',
};
import { PinContainer } from "../(default)/Credits/creditcards/credits";
import Hero from "@/components/hero";
import WhatWeDo from "@/components/whatwedo";
import Domains from "@/components/domains";
import "../css/additional-styles/landing.css";
import Activities from "@/components/activities";
import Image from "next/image";
import SparklesText from "@/components/magicui/sparkles-text";
import Achievements from '@/components/achievements';
import Founder from "@/components/founder";
import Share from "@/components/share";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Domains />
      <div className="-mt-20"> {/* Adjusted margin for Activities section */}
        <Activities />
        
      </div>
      <Founder />
      <Achievements />
      <Share />
    </>
  );
}
