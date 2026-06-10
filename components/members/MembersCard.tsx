"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { LinkedIn } from "@/components/Icons";

interface CardProps {
  name: string;
  role: string;
  company: string;
  linkedInUrl?: string;
  imageUrl?: string;
  leadDesc?: string;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
  isAlumni?: boolean;
}

const Card: React.FC<CardProps> = ({
  name,
  role,
  company,
  linkedInUrl,
  imageUrl,
  leadDesc,
  isAdmin,
  onEdit,
  onDelete,
  isFlipped,
  onFlip,
  isAlumni,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const hasImage = imageUrl;

  if (isAlumni) {
    return (
      <div
        className="relative touch-manipulation w-full max-w-[266px] h-[112px] mx-auto group cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => onFlip?.()}
      >
        {isAdmin && (
          <div className="absolute top-2 right-2 z-50 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="p-1 px-[0.375rem] rounded-full bg-pbgray border border-pbborder hover:border-pbgreen transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-pbtext hover:text-pbgreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1 px-[0.375rem] rounded-full bg-pbgray border border-pbborder hover:border-red-500 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-pbtext hover:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
              </svg>
            </button>
          </div>
        )}

        <div
          className={`relative w-full h-full transition-all duration-700 transform-3d ${
            isFlipped ? "transform-[rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 w-full h-full bg-[#1C1C1C] rounded-[20px] backface-hidden ${
              isFlipped ? "border border-pbgreen" : ""
            }`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div className="flex flex-col items-center justify-start pt-[17px] h-full w-full relative z-10 px-4">
              <div className="flex justify-center items-center px-[14px] py-[6px] bg-[#1A1A1A] rounded-[68px] outline outline-1 outline-[#262626] -outline-offset-1 max-w-full">
                <span className="text-[#37FF00] font-light text-[20px] leading-[30px] font-lexend text-center truncate">
                  {name}
                </span>
              </div>
              <div className="absolute top-[70px] w-full px-4 text-center left-0 right-0">
                <span className="text-[#B3B3B3] font-light text-[17px] leading-[23.8px] font-lexend truncate block">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] rounded-[20px] border border-pbgreen bg-[#1C1C1C] p-4 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {linkedInUrl && (
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="mb-2">
                  <LinkedIn className="h-8 w-8 text-pbgreen hover:text-white transition-colors" />
                </div>
              </a>
            )}
            {company && <p className="text-pbgreen text-[15px]">@{company}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative touch-manipulation w-full max-w-[299px] mx-auto group ${
        !hasImage ? "h-fit cursor-pointer" : "h-full"
      }`}
      style={{ perspective: "1000px" }}
      onClick={() => {
        if (!hasImage) onFlip?.();
      }}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-50 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 rounded-full bg-pbgray border border-pbborder hover:border-pbgreen transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-pbtext hover:text-pbgreen"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-1.5 rounded-full bg-pbgray border border-pbborder hover:border-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 text-pbtext hover:text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </button>
        </div>
      )}

      <div
        className={`relative w-full h-full transition-all duration-700 transform-3d ${
          !hasImage && isFlipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        <div
          className={`relative flex flex-col w-full h-full rounded-[48px] border border-pbborder hover:border-pbgreen bg-pbpages pt-[18px] pb-[19px] px-[18px] gap-[19px] items-center justify-start backface-hidden transition-colors ${
            isFlipped && !hasImage ? "border-pbgreen" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {hasImage && (
            <div
              className="relative w-full aspect-[263/250] max-w-[263px] mx-auto perspective-[1000px] shrink-0 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] cursor-pointer"
              onClick={() => onFlip?.()}
            >
              <div
                className={`relative w-full h-full transition-all duration-700 transform-3d ${
                  isFlipped ? "transform-[rotateY(180deg)]" : ""
                }`}
              >
                <div
                  className="absolute inset-0 z-10 overflow-hidden rounded-[30px] backface-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {!imageLoaded && (
                    <div className="absolute inset-0 z-20 bg-pbdarkgray overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-pbgreen/10 to-transparent animate-shimmer" />
                    </div>
                  )}
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    loading="lazy"
                    decoding="async"
                    className="object-cover object-center"
                    draggable={false}
                    onLoadingComplete={() => setImageLoaded(true)}
                  />
                </div>

                <div
                  className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] rounded-[30px] border border-white/50 bg-pbpages p-4 flex flex-col items-center justify-center text-center z-20"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {linkedInUrl && (
                    <a
                      href={linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="mb-2">
                        <LinkedIn className="h-8 w-8 text-pbgreen hover:text-white transition-colors" />
                      </div>
                    </a>
                  )}
                  <p className="text-white text-sm font-light mb-1">
                    {leadDesc || role}
                  </p>
                  {company && (
                    <p className="text-pbgreen text-xs">@{company}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col items-center gap-[24px] w-full relative z-30 flex-1 justify-center">
            <span className="text-pbgreen font-light whitespace-normal break-words bg-[#1A1A1A] w-fit h-fit text-center rounded-[68px] px-[16px] py-[6px] text-base sm:text-[19px] leading-tight sm:leading-[28px] border border-[#262626] capitalize max-w-full">
              {name}
            </span>

            {!hasImage && (
              <p className="text-pbtext font-light text-center text-sm mt-1">
                {role}
              </p>
            )}
          </div>
        </div>

        {!hasImage && (
          <div
            className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] rounded-[48px] border border-pbgreen bg-pbpages p-6 flex flex-col items-center justify-center text-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            {linkedInUrl && (
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="mb-4">
                  <LinkedIn className="h-10 w-10 text-pbgreen hover:text-white transition-colors" />
                </div>
              </a>
            )}
            {company && <p className="text-pbgreen text-[17px]">@{company}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
