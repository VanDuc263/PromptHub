import { AlertTriangle, Bookmark, Clock3, Code2, Folder, Layers3, PenLine, SearchX, Sparkles, Upload, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { RemoveSavedDialog } from "@/components/saved/remove-saved-dialog";
import { SavedCard } from "@/components/saved/saved-card";
import { SavedHeader } from "@/components/saved/saved-header";
import { SavedSidebar } from "@/components/saved/saved-sidebar";
import { Button } from "@/components/ui/button";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSavedPrompts, removeSavedPrompts } from "@/store/saved-prompts-slice";
import type { SavedPrompt } from "@/types";

const quickFilters = ["All", "Recently Saved", "Recently Used", "Programming", "Writing", "Java", "Spring Boot", "Backend", "Interview"];
const filterOptions = {
  category: ["All categories", "Programming", "Writing", "Business", "Marketing", "Education", "Design", "Interview"],
  language: ["All languages", "English", "Vietnamese"],
  model: ["All models", "GPT-5", "Claude", "Gemini", "DeepSeek", "Grok"],
  visibility: ["All visibility", "Public", "Private"],
};
const statisticIcons = [Bookmark, Folder, Clock3, Layers3];

const categoryPresentation = {
  Programming: { icon: Code2, accent: "bg-emerald-500/10 text-emerald-300" },
  Writing: { icon: PenLine, accent: "bg-amber-500/10 text-amber-300" },
};
const pageLoadedAt = Date.now();

function relativeDate(value: string) {
  const days = Math.max(0, Math.floor((pageLoadedAt - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export function SavedPage({ onExplore, onAction, onOpenPrompt }: { onExplore: () => void; onAction: (label: string) => void; onOpenPrompt: (promptId: string, visibility: "Public" | "Private") => void }) {
  const { removeMany } = useSavedPrompts();
  const dispatch = useAppDispatch();
  const requestedRef = useRef(false);
  const { prompts: apiPrompts, status, error } = useAppSelector((state) => state.savedPrompts);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recently Saved");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [quickFilter, setQuickFilter] = useState("All");
  const [filters, setFilters] = useState({ category: "All categories", language: "All languages", model: "All models", visibility: "All visibility" });
  const [selected, setSelected] = useState<string[]>([]);
  const [removeTargets, setRemoveTargets] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    void dispatch(fetchSavedPrompts());
  }, [dispatch]);

  const savedPromptCatalog = useMemo<SavedPrompt[]>(() => apiPrompts.map((prompt, index) => {
    const presentation = categoryPresentation[prompt.category as keyof typeof categoryPresentation]
      ?? { icon: Sparkles, accent: "bg-violet-500/10 text-violet-300" };
    return {
      ...prompt,
      ...presentation,
      updatedAt: relativeDate(prompt.updatedAt),
      savedAt: relativeDate(prompt.savedAt),
      savedOrder: index,
    };
  }), [apiPrompts]);

  const savedStatistics = useMemo(() => [
    { label: "Saved Prompts", value: String(apiPrompts.length) },
    { label: "Collections", value: "8" },
    { label: "Recently Saved", value: String(apiPrompts.filter((prompt) => pageLoadedAt - new Date(prompt.savedAt).getTime() < 7 * 86_400_000).length) },
    { label: "Most Used", value: String(Math.max(0, ...apiPrompts.map((prompt) => prompt.copies))) },
  ], [apiPrompts]);

  const prompts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = savedPromptCatalog.filter((prompt) => {
      if (normalized && !`${prompt.title} ${prompt.description} ${prompt.author} ${prompt.tags.join(" ")}`.toLowerCase().includes(normalized)) return false;
      if (filters.category !== "All categories" && prompt.category !== filters.category) return false;
      if (filters.language !== "All languages" && prompt.language !== filters.language) return false;
      if (filters.model !== "All models" && !prompt.models.includes(filters.model)) return false;
      if (filters.visibility !== "All visibility" && prompt.visibility !== filters.visibility) return false;
      if (!["All", "Recently Saved", "Recently Used"].includes(quickFilter) && !`${prompt.category} ${prompt.tags.join(" ")}`.toLowerCase().includes(quickFilter.toLowerCase())) return false;
      return true;
    });
    return result.sort((a, b) => {
      if (sort === "A-Z") return a.title.localeCompare(b.title);
      if (sort === "Highest Rated") return b.rating - a.rating;
      if (sort === "Most Popular") return b.copies - a.copies;
      if (sort === "Recently Updated") return a.updatedAt.localeCompare(b.updatedAt);
      return a.savedOrder - b.savedOrder;
    });
  }, [filters, query, quickFilter, savedPromptCatalog, sort]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= prompts.length) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisibleCount((count) => Math.min(count + 4, prompts.length)), { rootMargin: "180px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [prompts.length, visibleCount]);

  const confirmRemove = () => {
    const targets = [...removeTargets];
    void dispatch(removeSavedPrompts(targets)).unwrap().then(() => {
      removeMany(targets);
      setSelected((ids) => ids.filter((id) => !targets.includes(id)));
      onAction(targets.length > 1 ? `${targets.length} prompts removed from Saved` : "Prompt removed from Saved");
      setRemoveTargets([]);
    });
  };

  return (
    <>
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <SavedHeader
          query={query}
          sort={sort}
          view={view}
          onQueryChange={(value) => { setQuery(value); setVisibleCount(8); }}
          onSortChange={setSort}
          onViewChange={setView}
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {savedStatistics.map((stat, index) => {
            const Icon = statisticIcons[index];
            return status === "loading" || status === "idle" ? <div key={stat.label} className="h-24 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" /> : (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4">
                <div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-slate-600">{stat.label}</p><Icon className="size-4 text-emerald-400" /></div>
                <p className="mt-3 text-2xl font-semibold text-slate-100">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="sticky top-[72px] z-20 -mx-4 mt-6 border-y border-white/[.06] bg-[#0d1117]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filterOptions).map(([key, options]) => (
              <select key={key} value={filters[key as keyof typeof filters]} onChange={(event) => { setFilters((current) => ({ ...current, [key]: event.target.value })); setVisibleCount(8); }} aria-label={key} className="h-8 rounded-lg border border-white/[.08] bg-[#161b22] px-2.5 text-[10px] capitalize text-slate-400 outline-none focus:border-emerald-500/50">
                {options.map((option) => <option key={option}>{option}</option>)}
              </select>
            ))}
          </div>
          <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
            {quickFilters.map((filter) => <button type="button" key={filter} onClick={() => { setQuickFilter(filter); setVisibleCount(8); }} className={cn("shrink-0 rounded-full border px-3 py-1.5 text-[10px] transition", quickFilter === filter ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" : "border-white/[.07] text-slate-600 hover:text-slate-300")}>{filter}</button>)}
          </div>
        </div>

        {selected.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/[.06] p-3">
            <span className="mr-auto text-xs font-medium text-emerald-300">{selected.length} selected</span>
            <Button size="sm" variant="secondary" onClick={() => setRemoveTargets(selected)}>Remove selected</Button>
            <Button size="sm" variant="secondary" onClick={() => onAction("Move to collection opened")}>Move to collection</Button>
            <Button size="sm" variant="secondary" onClick={() => onAction("Selected prompts exported")}><Upload className="size-3.5" /> Export</Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}><X className="size-3.5" /> Clear selection</Button>
          </motion.div>
        )}

        <div className="mt-5 grid min-w-0 gap-5 2xl:grid-cols-[minmax(0,1fr)_250px]">
          <main className="min-w-0">
            {status === "failed" ? (
              <div className="rounded-2xl border border-dashed border-rose-500/20 px-6 py-20 text-center">
                <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-rose-500/[.07]"><AlertTriangle className="size-7 text-rose-400/70" /></div>
                <h2 className="mt-5 text-base font-semibold text-slate-200">Unable to load saved prompts</h2>
                <p className="mt-2 text-xs text-rose-300/70">{error}</p>
                <Button variant="secondary" className="mt-6" onClick={() => void dispatch(fetchSavedPrompts())}>Retry</Button>
              </div>
            ) : status === "loading" || status === "idle" ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" />)}</div>
            ) : prompts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[.08] px-6 py-20 text-center">
                <div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/[.05]"><Bookmark className="size-7 text-emerald-400/60" /><SearchX className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#0d1117] p-1 text-slate-500" /></div>
                <h2 className="mt-5 text-base font-semibold text-slate-200">No saved prompts yet</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Browse Explore and save useful prompts to build your personal prompt library.</p>
                <Button className="mt-6 bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={onExplore}><Sparkles className="size-4" /> Explore Community</Button>
              </div>
            ) : (
              <>
                <motion.div layout className={cn("grid gap-3", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>
                  {prompts.slice(0, visibleCount).map((prompt) => <SavedCard key={prompt.id} prompt={prompt} selected={selected.includes(prompt.id)} list={view === "list"} onSelect={() => setSelected((ids) => ids.includes(prompt.id) ? ids.filter((id) => id !== prompt.id) : [...ids, prompt.id])} onRemove={() => setRemoveTargets([prompt.id])} onOpen={() => onOpenPrompt(prompt.id, prompt.visibility)} onAction={onAction} />)}
                </motion.div>
                <div ref={loadMoreRef} className="h-12" />
              </>
            )}
          </main>
          <SavedSidebar />
        </div>
      </div>
      <RemoveSavedDialog open={removeTargets.length > 0} count={removeTargets.length} onOpenChange={(open) => !open && setRemoveTargets([])} onConfirm={confirmRemove} />
    </>
  );
}
