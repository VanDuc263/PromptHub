import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  compact = false,
  onClick,
}: {
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-10 items-center gap-2.5 rounded-lg border border-white/[.08] bg-white/[.035] px-3 text-sm text-slate-500 outline-none transition hover:border-white/[.14] hover:bg-white/[.055] focus-visible:ring-2 focus-visible:ring-violet-500/60",
        compact ? "size-10 justify-center px-0" : "w-full max-w-[440px]",
      )}
      aria-label="Search prompts"
    >
      <Search className="size-4 shrink-0 transition-colors group-hover:text-slate-300" />
      {!compact && (
        <>
          <span className="truncate">Search prompts...</span>
          <kbd className="ml-auto rounded border border-white/[.08] bg-black/20 px-1.5 py-0.5 font-sans text-[10px] text-slate-600">
            Ctrl K
          </kbd>
        </>
      )}
    </button>
  );
}
