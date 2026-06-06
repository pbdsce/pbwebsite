"use client";
import Image from "next/image";

export default function EventCard({
  title,
  description,
  image,
  date,
  location,
  registrationLink,
  isFlipped,
  onToggle,
  isAdmin,
  onEdit,
  onDelete,
}: {
  title: string;
  description: string;
  image?: string;
  date?: string;
  location?: string;
  registrationLink?: string;
  isFlipped?: boolean;
  onToggle?: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="group relative w-full h-full cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={onToggle}
    >
      {isAdmin && (
        <div className="absolute top-2 right-2 z-10 flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-1.5 rounded-full bg-pbgray border border-pbborder hover:border-pbgreen transition-colors"
            title="Edit"
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
            title="Delete"
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
        className={`flex flex-col gap-2 rounded-2xl bg-pbsurface p-3 h-full transition-all duration-300 ease-in-out
                ${isFlipped ? "rotate-y-180 border border-pbgreen" : "rotate-y-0 shadow-none border border-white/10"}
                ${!isFlipped ? "group-hover:border-pbgreen hover:border-pbgreen" : ""} `}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: "hidden" }}
          className="flex flex-col gap-2 h-full"
        >
          {/* Image area */}
          <div className="relative w-full overflow-hidden rounded-xl bg-[#222] aspect-4/3">
            {image && (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover select-none"
                draggable={false}
                loading="lazy"
              />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1 p-1 pl-2">
            <span className="text-xl lg:text-3xl font-medium leading-normal align-middle bg-linear-to-b from-[#37FF00] to-[#219900] bg-clip-text text-transparent">
              {title}
            </span>
            <span className="text-sm font-normal leading-normal text-white/65 line-clamp-1">
              {description}
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex flex-col gap-3 rounded-2xl bg-pbsurface p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <span className="text-lg lg:text-xl font-medium leading-snug text-[#37FF00] text-center w-full">
            {title}
          </span>
          <div className="text-xs md:text-sm text-white/80">
            <strong className="text-pbgreen">Date:</strong>{" "}
            {date
              ? new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "TBA"}
          </div>
          <div className="text-xs md:text-sm text-white/80">
            <strong className="text-pbgreen">Location:</strong>{" "}
            {location || "TBA"}
          </div>
          <p className="mt-2 text-xs md:text-sm leading-relaxed text-white/60 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-pbtext/5 [&::-webkit-scrollbar-track]:rounded-3xl [&::-webkit-scrollbar-thumb]:bg-pbtext/25 [&::-webkit-scrollbar-thumb]:rounded-full">
            {description}
          </p>

          {registrationLink && (
            <div className="text-xs md:text-sm text-white/80">
              <strong className="text-pbgreen">Registration Link:</strong>{" "}
              <a
                href={registrationLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {registrationLink}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
