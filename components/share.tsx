/** @jsxImportSource react */
import React from "react";
import Image from "next/image"; // Assuming you are using next/image for optimization
import { ContributorsBtn } from "./ContributorsBtn";

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
          <div className="w-full max-w-md">
            {/* Card 1 - LinkedIn */}
            <div className="bg-gradient-to-tr from-blue-600 to-blue-300 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4">
                {/* Replace the src with the actual Slack logo you use */}
                <Image
                  src="/images/ln.webp"
                  alt="Slack Logo"
                  width={150}
                  height={50}
                />
              </div>
              <h3 className="text-lg font-bold mb-2">Follow us on Linkedin</h3>
              <p className="flex-grow">
                Stay updated with our latest achievements, tech insights, and
                community highlights on LinkedIn.
              </p>
              <div className="mt-4">
                <a
                  className="btn-sm px-4 py-2 text-l font-bold bg-gradient-to-tr from-blue-600 to-blue-800 mx-3 rounded-xl inline-block"
                  href="https://www.linkedin.com/company/point-blank-d"
                >
                  Follow Us
                </a>
              </div>
            </div>
          </div>

          <div className="w-full max-w-md">
            {/* Card 2 - Instagram */}
            <div className="bg-gradient-to-tr from-purple-400 to-pink-500 p-6 rounded-lg shadow-md text-white rounded-xl flex flex-col h-full">
              <div className="flex justify-start mb-4">
                {/* Replace with Insta logo */}
                <Image
                  src="/images/ig.webp"
                  alt="Insta Logo"
                  width={150}
                  height={50}
                />
              </div>
              <h3 className="text-lg font-bold mb-2">Follow Us On Instagram</h3>
              <p className="flex-grow">
                We post about upcoming events, activities, and other cool stuff
                on Instagram.
              </p>
              <div className="mt-4">
                <a
                  className="btn-sm px-4 py-2 text-l font-bold text-white bg-gradient-to-tr from-purple-400 to-pink-500 mx-3 rounded-xl inline-block"
                  href="https://www.instagram.com/pointblank_dsce/"
                >
                  Follow Us
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
