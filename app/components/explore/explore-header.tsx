import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export function ExploreHeader({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (query: string) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const focusSearch = () => searchRef.current?.focus();
    window.addEventListener("prompthub:focus-explore-search", focusSearch);
    return () => window.removeEventListener("prompthub:focus-explore-search", focusSearch);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 border-b border-white/[.07] pb-6 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-2xl">
        <h1 className="mt-3 text-3xl font-bold tracking-[-.035em] text-slate-50 sm:text-4xl">Explore Community</h1>
      </div>
      <div className="relative w-full lg:max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
        <input
          ref={searchRef}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search prompts..."
          aria-label="Search community prompts"
          className="h-11 w-full rounded-xl border border-white/[.08] bg-[#161b22] pl-10 pr-20 text-sm text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-emerald-500/45 focus:ring-2 focus:ring-emerald-500/10"
        />
        {query ? (
          <button type="button" onClick={() => onQueryChange("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300"><X className="size-4" /></button>
        ) : (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/[.08] bg-[#0d1117] px-2 py-1 font-sans text-[9px] text-slate-600">Ctrl K</kbd>
        )}
      </div>
    </motion.header>
  );
}
