import type { ReactNode } from "react";

export default function OssStatCard({
  icon,
  title,
  value,
}: {
  icon: ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="relative flex min-h-[120px] flex-col justify-center overflow-hidden rounded-[16px] bg-[#1c1c1c] p-5 sm:min-h-[160px] sm:rounded-[20px] sm:p-6 md:min-h-[200px]">
      <span className="pr-14 text-sm text-zinc-400 sm:pr-20 sm:text-base md:text-[17px]">
        {title}
      </span>
      <span className="mt-2 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-4xl font-medium text-transparent sm:mt-3 sm:text-5xl md:text-6xl lg:text-[80px]">
        {value}
      </span>
      <div className="pointer-events-none absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 text-pbgreen opacity-90 sm:right-6 sm:h-14 sm:w-14 md:h-16 md:w-16">
        {icon}
      </div>
    </div>
  );
}
