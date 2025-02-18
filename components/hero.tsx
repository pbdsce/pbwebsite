'use client';
import "../app/css/additional-styles/landing.css";
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";
import { TextGenerateEffect } from "./ui/text-generate-effect";

export default function Hero() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-10 inset-0 flex items-center justify-center pointer-events-none w-full">
        <section className="relative z-1 min-h-screen flex justify-center items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <div className="pt-20 sm:pt-32 pb-5 md:pt-20">
              <motion.p>
                <ReactTyped
                  strings={["Knock Knock.. (・.・)ノ Who's There?"]}
                  typeSpeed={60} 
                  backSpeed={50}
                  showCursor={false}
                  className="text-lg sm:text-2xl md:text-4xl font-bold mb-6"
                />
              </motion.p>
              
              <div className="text-lg sm:text-2xl md:text-5xl text-gray-100 font-bold text-left">
                <div className="mb-3 text-center">
                  <TextGenerateEffect words="Hi, We are Point Blank." delay={4} duration={0.3}/>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0}}
                  transition={{ delay: 5, type: "smooth", duration: 0.5 }}
                  className="min-h-[4rem]" 
                >
                  A student run{" "}
                  <span className="min-w-[200px]">
                    <ReactTyped
                      className="bg-[#00c853] p-2 sm:p-3 rounded-xl z-1 "
                      strings={[
                        "sausage fest.",
                        "tech community.",
                        "competitions club.",
                        "arrogant elitist society.",
                        "innovation arena.",
                      ]}
                      typeSpeed={30}
                      backSpeed={40}
                      loop
                    />
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </BackgroundGradientAnimation>
  );
}
