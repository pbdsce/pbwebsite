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
import Link from "next/link";
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
import Contributors from "@/components/contributors";
import Footer from '@/components/ui/footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow h-screen overflow-y-scroll overflow-x-hidden snap-y snap-mandatory">
        <div className="snap-start h-screen w-full">
          <Hero />
        </div>
        <div className="snap-start h-screen w-full">
          <WhatWeDo />
        </div>
        <div className="snap-start min-h-screen w-full">
          <Domains />
        </div>
        <div className="snap-start min-h-screen w-full overflow-hidden">
          <div className="-mt-20">
            <Activities />
          </div>
        </div>
        <div className="snap-start min-h-screen w-full">
          <Founder />
        </div>
        <div className="snap-start min-h-screen w-full">
          <Achievements />
        </div>
        <div className="snap-start min-h-screen w-full">
          <Share />
        </div>
        <div className="snap-start min-h-screen w-full">
          <Contributors />
        </div> 
        <div className="snap-start w-full">
          <Footer />
        </div> 
      </div>
    </div>
  );
}
