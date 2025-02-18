import Image from "next/image";
import logo from "@/public/images/alien.webp";

export default function WhatWeDo() {
  return (
    <section className="py-12 max-w-6xl md:mx-20 mx-5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-100 to-[#00c853]">Mission</span>, together.
            </h2>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-6">
              In Point Blank, we believe in the concept of no spoon-feeding. We are here to help you learn and grow together. We are a community of coders, hackers, developers, and tech enthusiasts passionate about technology and learning.
            </p>
            {/* List of Values */}
            <div className="text-left">
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">1</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Connect with other coders</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Have a coding question? Looking for project feedback? Just hit the Pseudorandom group chat.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">2</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Want to learn something new?</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    We have a variety of people willing to help you learn new things. Dont just ask how to get started, ask what to do next.
                  </p>
                </div>
              </div>
              <div className="flex items-start mb-4">
                <div className="text-[#00c853] font-bold text-xl sm:text-2xl mr-4">3</div>
                <div>
                  <h3 className="font-semibold text-lg sm:text-xl">Feeling bored?</h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    We are not just about coding. We are also a group of friends who love to play games, going out on trips, and having fun.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column with Image */}
          <div className="lg:w-1/2 flex justify-left lg:justify-end">
            <Image src={logo} alt="Logo" width={300} height={300} className="shadow-lg rounded-lg" unoptimized />
          </div>
        </div>
      </div>
    </section>
  );
}