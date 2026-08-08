import { Search } from "lucide-react";

export default function OssSearchInput({
  value,
  onChange,
  placeholder = "Search",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative w-full sm:w-65">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9.5 w-full rounded-[10px] border border-pbborder bg-pbdarkgray py-2 pl-10 pr-4 text-sm font-light text-white placeholder:text-white/50 outline-none"
      />
    </div>
  );
}
