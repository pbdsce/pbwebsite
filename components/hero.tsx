import logo from "@/public/images/logo.svg";
import Link from "next/link";
import Image from "next/image";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { cn } from "@/lib/server/utils";
import TypingAnimation from "@/components/ui/typing-animation";
import "../app/css/additional-styles/landing.css";
import PBCTFbanner from "@/components/PBCTFbanner";


export default function Hero() {
  return (
    <section className="relative h-screen flex justify-center items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-20 sm:pt-32 pb-5 md:pt-40 md:pb-5">
            <div className="pb-5 md:pb-5">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
                  {/* Left content */}
                  <div className="flex-1">
                    <TypingAnimation
                      className="text-3xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8"
                      text="Hey there! 👋"
                      duration={50}
                    />
                    <p
                      className="text-3xl sm:text-3xl md:text-4xl text-gray-100 mb-6 sm:mb-8 font-bold"
                      data-aos="zoom-y-out"
                      data-aos-delay="450"
                    >
                      We are a student-run<br />
                      <span className="bg-[#00c853] p-2 sm:p-3 rounded-xl" style={{ wordBreak: 'keep-all' }}>tech-community</span> from Dayananda Sagar College of Engineering.
                    </p>
                  </div>
                  <PBCTFbanner/>
                </div>
              </div>
            </div>
          </div>
        </div>
      <FlickeringGrid
        className="z-1 absolute inset-0 size-full"
        squareSize={8}
        gridGap={10}
        color="green"
        maxOpacity={0.25}
        flickerChance={0.5}
      />
    </section>
  );
}
