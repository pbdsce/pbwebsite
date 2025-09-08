import logo from "@/public/images/logo.svg";
import Link from "next/link";
import Image from "next/image";
import FlickeringGrid from "@/components/magicui/flickering-grid";
import { cn } from "@/lib/server/utils";
import TypingAnimation from "@/components/ui/typing-animation";
import "../app/css/additional-styles/landing.css";
import SIHbanner from "@/components/SIHbanner";
import RecruitmentBanner from "@/components/RecruitmentBanner";


export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen flex justify-center items-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="pt-24 sm:pt-36 pb-20 md:pt-44 md:pb-32 mt-0 md:mt-20 landscape:pt-20 landscape:pb-16">
            <div className="pb-10 md:pb-20 landscape:pb-8">
              <div className="max-w-7xl mx-auto">
                <div className="hero-content flex flex-col lg:flex-row lg:items-center lg:gap-6 xl:gap-8">
                  {/* Left content */}
                  <div className="flex-1 lg:max-w-2xl xl:max-w-2xl lg:flex lg:flex-col lg:justify-center">
                    <TypingAnimation
                      className="hero-text text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6"
                      text="Hey there! 👋"
                      duration={50}
                    />
                    <p
                      className="hero-text text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-gray-100 mb-4 sm:mb-6 font-bold leading-tight"
                      data-aos="zoom-y-out"
                      data-aos-delay="450"
                    >
                      We are a student-run<br />
                      <span className="bg-[#00c853] px-2  sm:px-3 sm:py-1 rounded-xl" style={{ wordBreak: 'keep-all' }}>tech-community</span> from Dayananda Sagar College of Engineering.
                    </p>
                  </div>
                  
                  {/* Right content - banners */}
                  <div className="hero-banners flex flex-col items-center gap-3 lg:gap-6 xl:gap-4 w-full lg:w-auto xl:flex-shrink-0">
                    <div className="w-full max-w-xs lg:max-w-md xl:max-w-sm">
                      <RecruitmentBanner />
                    </div>
                    <div className="w-full max-w-xs lg:max-w-md xl:max-w-sm">
                      <SIHbanner />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      <FlickeringGrid
        className="z-1 absolute inset-0 w-full h-full"
        squareSize={8}
        gridGap={10}
        color="green"
        maxOpacity={0.25}
        flickerChance={0.5}
      />
    </section>
  );
}
