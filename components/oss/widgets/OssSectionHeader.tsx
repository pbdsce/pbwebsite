export default function OssSectionHeader({
  title,
  onViewAll,
}: {
  title: string;
  onViewAll?: () => void;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3 sm:mb-6 sm:gap-4">
      <h2 className="text-xl font-normal text-white sm:text-2xl md:text-[2rem]">
        {title}
      </h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="shrink-0 rounded-[10px] bg-pbgray px-4 py-2 text-sm text-white capitalize transition-colors hover:bg-pbborder sm:px-5 sm:text-base"
        >
          View All
        </button>
      )}
    </div>
  );
}
