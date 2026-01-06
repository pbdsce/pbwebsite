/** @jsxImportSource react */
import React from "react";
import Image from "next/image"; // Assuming you are using next/image for optimization
import { ContributorsBtn } from "./ContributorsBtn";
import { FaInstagram } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa6";
interface ShareProps {}

const Share: React.FC<ShareProps> = () => {

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-100 mt-2 p-2">
          Stay <span className="text-green-500">Connected</span>
        </h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {/* All cards in a single grid */}
          <div className="flex justify-center items-center h-full w-full">
      
   <div className="w-full max-w-md flex">
  <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-emerald-400/40 via-transparent to-emerald-400/60">
    
    <div className="bg-gradient-to-r from-black via-[#0f2f25] to-emerald-400 p-6 rounded-xl shadow-md text-white flex h-full relative overflow-hidden">
      
      {/* Inner soft highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      <div id="left" className="flex flex-col">
        <h3 className="text-2xl font-bold mb-2">Connect With Us</h3>

        <p className="flex-grow w-[90%] text-white/80">
          Follow us across all our social platforms to stay updated with events, releases and community highlights.
        </p>

        <div className="mt-4 flex h-[70px] items-center">
          <button className="px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300 ">
            Follow Us 
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-6 ml-6">
        <div className="w-14 h-14 rounded-full bg-emerald-400/30 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <a href="https://www.instagram.com/pointblank_club_/"><FaInstagram  className="text-white text-3xl"/></a>
        </div>

        <div className="w-14 h-14 rounded-full bg-emerald-400/30 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <a href="https://www.linkedin.com/company/point-blank-d/"><FaLinkedin className="text-white text-3xl" /></a>
        </div>

        <div className="w-14 h-14 rounded-full bg-emerald-400/30 border border-white/20 backdrop-blur-md flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <a href="https://x.com/pointblank_club"><BsTwitterX className="text-white text-2xl"/></a>
        </div>
          </div>
         </div>
         </div>
        </div>
       </div>
          <div className="w-full max-w-md">
            {/* Card 2 - Hire Us */}
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4">
                <p className="text-2xl font-bold">💼 Hire us</p>
              </div>
              <h3 className="text-lg font-bold mb-2">Have a project in mind?</h3>
              <p className="flex-grow">
               Let&apos;s discuss how we can bring your ideas to life and help your business succeed with our expertise.
              </p>
              <div className="mt-4">
                <a
                  className="btn-sm px-4 py-2 text-l font-bold text-white  bg-gradient-to-tr from-orange-600 to-orange-400 mx-3 rounded-xl inline-block"
                  href="https://careers.pointblank.club/"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md">
            {/* Card 3 - Blog */}
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-500 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4">
                <Image
                  src="https://res.cloudinary.com/pbsite/image/fetch/f_auto,q_auto/https://img.icons8.com/ios/50/FFFFFF/blog.png"
                  alt="Blog Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg font-bold mb-2">Read Our Blog</h3>
              <p className="flex-grow">
                Explore stories and experiences shared by our members on their
                tech journey and community adventures.
              </p>
              <div className="mt-4">
                <a
                  className="btn-sm px-4 py-2 text-l font-bold text-white bg-gradient-to-tr from-cyan-500 to-blue-500 mx-3 rounded-xl inline-block"
                  href="https://blog.pointblank.club"
                >
                  Read Now
                </a>
              </div>
            </div>
          </div>
          {/* Card 4 - Brochure */}
          <div className="w-full max-w-md">
            <div className="bg-gradient-to-tr from-green-500 to-green-300 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4">
                <p className="text-2xl font-bold">📄 Brochure </p>
              </div>
              <h3 className="text-lg font-bold mb-2">Download our Brochure</h3>
              <p className="flex-grow">
                We have listed all of recent events, activities, and other stats
                in our brochure.
              </p>
              <div className="mt-4">
                <a
                  className="btn-sm px-4 py-2 text-l font-bold bg-gradient-to-tr from-green-500 to-green-300 mx-3 rounded-xl inline-block"
                  href="/brochure.pdf"
                >
                  Download Now
                </a>
              </div>
            </div>
          </div>
          {/* Card 5 - Youtube */}
          <div className="w-full max-w-md">
            <div
              className="relative p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full overflow-hidden"
              style={{
                backgroundImage: `url(https://res.cloudinary.com/pbsite/image/upload/f_auto,q_auto,c_thumb,w_200,g_face/v1737399749/WhatsApp_Image_2025-01-14_at_11.24.24_k3xyj5.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-sm bg-black/50"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-start mb-4">
                  <Image
                   src="https://res.cloudinary.com/pbsite/image/fetch/f_auto,q_auto/https://img.icons8.com/color/48/youtube-play.png"
                    alt="YouTube Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Jam to Our Latest Mixtape!
                </h3>
                <p className="flex-grow">
                  We include all the tracks, vibes, and energy of our mixtapes -
                  Check it out now!
                </p>
                <div className="mt-4">
                  <a
                    className="btn-sm px-4 py-2 text-l font-bold bg-black/30 hover:bg-black/50 mx-3 rounded-xl inline-block"
                    href="https://www.youtube.com/watch?v=2vk-hb0quBg&list=PLrHlqWSNnbvTMbGsDrM3Uu_p2o-x4BfSn"
                  >
                    Tune In
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md">
            {/* Card 6 - Contributors */}
            <div className="bg-gradient-to-tr from-gray-900 to-indigo-800 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4 items-center">
                <Image
                  src="https://img.icons8.com/?size=100&id=62856&format=png&color=000000"
                  alt="GB Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <p className="text-2xl font-bold">GitHub</p>
              </div>
              <h3 className="text-lg font-bold mb-2">Project Contributors</h3>
              <p className="flex-grow">
                Meet the amazing contributors who have helped shape this project
                with their dedication and hard work.
              </p>
              <div className="mt-4">
                <ContributorsBtn />
              </div>
            </div>
          </div>
        </div>
      </div>
       
    </section>
  );
};

export default Share;
