"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OssFilterMenu({
  children,
  className,
  panelClassName,
}: {
  children: (controls: { close: () => void }) => ReactNode;
  className?: string;
  panelClassName?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative w-full sm:w-auto", className)}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={cn(
          "flex h-9.5 w-full items-center justify-center gap-2 rounded-[10px] border border-pbborder px-4 text-sm font-medium text-white transition-colors sm:w-auto",
          isOpen ? "bg-pbgreen text-black" : "bg-pbdarkgray hover:bg-pbborder",
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filter
      </button>

      {isOpen && (
        <div
          className={cn(
            "mt-2 w-full rounded-[10px] border border-[#2a2a2a] bg-pbdarkgray p-2 shadow-lg sm:absolute sm:right-0 sm:top-full sm:z-30 sm:mt-2 sm:w-auto sm:min-w-40",
            panelClassName,
          )}
        >
          {children({ close: () => setIsOpen(false) })}
        </div>
      )}
    </div>
  );
}
