import { Grid2X2, List, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SavedHeader({
  query,
  sort,
  view,
  onQueryChange,
  onSortChange,
  onViewChange,
}: {
  query: string;
  sort: string;
  view: "grid" | "list";
  onQueryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewChange: (value: "grid" | "list") => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focus = () => inputRef.current?.focus();
    window.addEventListener("prompthub:focus-saved-search", focus);
    return () => window.removeEventListener("prompthub:focus-saved-search", focus);
  }, []);

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Saved</h1>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search saved prompts..."
            className="h-10 w-full rounded-lg border border-white/10 bg-[#161b22] pl-9 pr-12 text-sm text-slate-200 outline-none placeholder:text-slate-700 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-slate-600">⌘K</kbd>
        </label>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort saved prompts"
          className="h-10 rounded-lg border border-white/10 bg-[#161b22] px-3 text-xs text-slate-300 outline-none focus:border-emerald-500/50"
        >
          {["Recently Saved", "Recently Updated", "Most Popular", "Highest Rated", "A-Z"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <div className="flex rounded-lg border border-white/10 bg-[#161b22] p-1">
          {(["grid", "list"] as const).map((item) => (
            <Button
              key={item}
              variant="icon"
              size="icon"
              aria-label={`${item} view`}
              onClick={() => onViewChange(item)}
              className={cn("size-8", view === item && "bg-white/[.08] text-emerald-400")}
            >
              {item === "grid" ? <Grid2X2 className="size-4" /> : <List className="size-4" />}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
