"use client";

import Head from 'next/head';
import type { NextPage } from 'next';

const TrollPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Video</title>
        <meta name="description" content="A video." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-black text-white">

        {/* Video container with a glowing effect */}
        <div className="w-full max-w-4xl rounded-lg shadow-2xl relative group">
            {/* Glowing background element */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600 to-blue-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            {/* Iframe container - now uses modern aspect-video class */}
            <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=0&showinfo=0"
                title="Secret Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
        </div>

      </main>
       {/* We need to add a custom animation for the tilt effect */}
       <style jsx global>{`
        @keyframes tilt {
          0%, 50%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(0.5deg);
          }
          75% {
            transform: rotate(-0.5deg);
          }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
      `}</style>
    </>
  );
};

export default TrollPage;
