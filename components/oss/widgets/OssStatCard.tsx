export default function OssStatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="flex min-h-[120px] flex-col rounded-[16px] bg-[#1c1c1c] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.22)] sm:min-h-[160px] sm:rounded-[20px] sm:p-6">
      <div className="mb-3 flex items-center gap-3 sm:mb-6 sm:gap-4">
        <h3 className="text-zinc-400 text-[10px] tracking-wider uppercase font-medium sm:text-sm sm:tracking-widest">
          {title}
        </h3>
      </div>
      <div className="mt-auto text-3xl font-medium text-white sm:text-4xl md:text-5xl">
        {value}
      </div>
    </div>
  );
}
