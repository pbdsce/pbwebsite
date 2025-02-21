'use client'
import React from 'react';

const LoadingBrackets = () => {
  return (
    <div className="relative">
      <svg className="w-[120px] h-[60px]" viewBox="0 0 120 60">
        <path 
          className="fill-none stroke-green-700 stroke-[5] stroke-round animate-[draw_1.5s_ease-in-out_infinite]"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            strokeLinecap: 'round'
          }}
          d="M40 15 L20 30 L40 45"
        />

        <path 
          className="fill-none stroke-green-700 stroke-[5] stroke-round animate-[draw_1.5s_ease-in-out_infinite]"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            strokeLinecap: 'round',
            animationDelay: '0.5s'
          }}
          d="M80 15 L100 30 L80 45"
        />

        <circle 
          className="fill-green-700 animate-[pop_1.5s_infinite]"
          style={{
            animationDelay: '1s',
            opacity: 0,
            transformOrigin: 'center'
          }}
          cx="50"
          cy="30"
          r="4"
        />
      </svg>

      <style jsx>{`
        @keyframes draw {
          0% {
            stroke-dashoffset: 100;
          }
          20%, 90% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: 100;
          }
        }

        @keyframes pop {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          5% {
            opacity: 1;
            transform: scale(1.2);
          }
          10%, 90% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingBrackets;
