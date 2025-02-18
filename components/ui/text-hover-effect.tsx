"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export const TextHoverEffect = ({
  text,
  duration,
  automatic = true,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (isMobile && automatic) {
      setHovered(true);
      const radius = 150; // Increased radius
      
      const animate = () => {
        const time = Date.now() / 3000; // Slower animation
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (svgRect) {
          const centerX = svgRect.left + svgRect.width / 2;
          const centerY = svgRect.top + svgRect.height / 2;
          const x = centerX + radius * Math.cos(time);
          const y = centerY + radius * Math.sin(time);
          setCursor({ x, y });
        }
      };

      const intervalId = setInterval(animate, 16);
      return () => clearInterval(intervalId);
    }
  }, [isMobile, automatic]);

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onMouseMove={(e) => !isMobile && setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {/* Show gradient always on mobile */}
          {(hovered || isMobile) && (
            <>
              <stop offset="0%" stopColor={"#a7f3d0"} /> {/* Light green */}
              <stop offset="25%" stopColor={"#34d399"} /> {/* Medium light green */}
              <stop offset="50%" stopColor={"#059669"} /> {/* Medium green */}
              <stop offset="75%" stopColor={"#047857"} /> {/* Medium dark green */}
              <stop offset="100%" stopColor={"#064e3b"} /> {/* Dark green */}
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r={isMobile ? "40%" : "20%"} // Bigger mask on mobile
          whileInView={maskPosition}
          transition={{ 
            duration: isMobile ? 0.8 : (duration ?? 0), 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 30
          }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={`font-[helvetica] font-bold stroke-neutral-200 dark:stroke-neutral-800 fill-transparent text-[3rem] `}
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className={`font-[helvetica] font-bold fill-transparent text-[3rem]   stroke-neutral-200 dark:stroke-neutral-800`}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        whileInView={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className={`font-[helvetica] font-bold fill-transparent text-[3rem]`}
      >
        {text}
      </text>
    </svg>
  );
};
