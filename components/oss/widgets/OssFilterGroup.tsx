import { Check } from "lucide-react";

type FilterOption<T extends string> = {
  id: T;
  label: string;
};

export default function OssFilterGroup<T extends string>({
  activeId,
  options,
  onChange,
  className = "",
}: {
  activeId: T;
  options: Array<FilterOption<T>>;
  onChange: (id: T) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      {options.map((option) => {
        const isActive = activeId === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`flex h-9 w-full items-center justify-between gap-3 rounded-md px-2 text-sm font-medium transition-colors ${
              isActive ? "text-pbgreen" : "text-white hover:text-pbgreen/80"
            }`}
          >
            {option.label}
            {isActive && <Check className="h-4 w-4 shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}
