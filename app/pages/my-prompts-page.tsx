import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PromptListItem } from "@/components/prompts/prompt-list-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchMyPrompts, updatePromptVisibility } from "@/store/my-prompts-slice";
import type { LibraryPrompt } from "@/types";

const stateFilters = ["Private", "Public", "Draft"] as const;

const accents: Record<string, string> = {
  Programming: "bg-cyan-400",
  Marketing: "bg-fuchsia-400",
  English: "bg-amber-400",
  Other: "bg-violet-400",
};

function relativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "just now";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(value).toLocaleDateString();
}

export function MyPromptsPage({
  onAction,
  onCreatePrompt,
  onOpenPrompt,
  onEditPrompt,
}: {
  onAction: (label: string) => void;
  onCreatePrompt: () => void;
  onOpenPrompt: (promptId: string) => void;
  onEditPrompt: (promptId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortNewest, setSortNewest] = useState(true);
  const dispatch = useAppDispatch();
  const requestedRef = useRef(false);
  const { prompts: apiPrompts, status, error } = useAppSelector((state) => state.myPrompts);
  const prompts = useMemo<LibraryPrompt[]>(() => apiPrompts.map((prompt) => ({
    ...prompt,
    updatedAt: relativeTime(prompt.updatedAt),
    accent: accents[prompt.category] ?? accents.Other,
  })), [apiPrompts]);
  const categoryFilters = useMemo(
    () => [...new Set(prompts.map((prompt) => prompt.category))],
    [prompts],
  );

  useEffect(() => {
    if (requestedRef.current || status !== "idle") return;
    requestedRef.current = true;
    void dispatch(fetchMyPrompts());
  }, [dispatch, status]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((filters) =>
      filters.includes(filter)
        ? filters.filter((item) => item !== filter)
        : [...filters, filter],
    );
  };

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const categories = activeFilters.filter((item) =>
      categoryFilters.includes(item as (typeof categoryFilters)[number]),
    );
    const states = activeFilters.filter((item) =>
      stateFilters.includes(item as (typeof stateFilters)[number]),
    );

    const results = prompts.filter((prompt) => {
      const matchesQuery =
        !normalizedQuery ||
        `${prompt.title} ${prompt.description} ${prompt.tags.join(" ")}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        categories.length === 0 || categories.includes(prompt.category);
      const matchesState =
        states.length === 0 ||
        states.some(
          (state) => prompt.visibility === state || prompt.status === state,
        );
      return matchesQuery && matchesCategory && matchesState;
    });

    return sortNewest ? results : [...results].reverse();
  }, [activeFilters, categoryFilters, prompts, query, sortNewest]);

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="mt-2 text-2xl font-bold tracking-[-.03em] text-slate-50 sm:text-3xl">
              My Prompts
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create, refine, and manage every prompt in your library.
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={onCreatePrompt}>
            <Plus className="size-4" /> New prompt
          </Button>
        </header>

        <section className="mt-8 rounded-xl border border-white/[.07] bg-[#161b22] p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your prompts..."
                aria-label="Search your prompts"
                className="h-11 w-full rounded-lg border border-white/[.08] bg-[#0d1117] pl-10 pr-10 text-sm text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/15"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 transition hover:text-slate-300"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="flex-1 lg:flex-none"
                onClick={() => setSortNewest((value) => !value)}
              >
                {sortNewest ? "Last updated" : "Oldest first"} <ChevronDown className="size-3.5" />
              </Button>
              <div className="flex rounded-lg border border-white/[.08] bg-[#0d1117] p-1">
                <button type="button" aria-label="List view" className="grid size-8 place-items-center rounded-md bg-white/[.07] text-slate-200">
                  <List className="size-4" />
                </button>
                <button type="button" aria-label="Grid view" onClick={() => onAction("Grid view selected")} className="grid size-8 place-items-center rounded-md text-slate-600 transition hover:text-slate-300">
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/[.06] pt-3">
            <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <SlidersHorizontal className="size-3.5" /> Filters
            </span>
            {categoryFilters.map((filter) => (
              <FilterButton
                key={filter}
                label={filter}
                active={activeFilters.includes(filter)}
                onClick={() => toggleFilter(filter)}
              />
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/[.08] sm:block" />
            {stateFilters.map((filter) => (
              <FilterButton
                key={filter}
                label={filter}
                active={activeFilters.includes(filter)}
                onClick={() => toggleFilter(filter)}
              />
            ))}
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilters([])}
                className="ml-auto text-[11px] text-slate-600 transition hover:text-violet-300"
              >
                Clear all
              </button>
            )}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <strong className="font-medium text-slate-300">{filteredPrompts.length}</strong>{" "}
            {filteredPrompts.length === 1 ? "prompt" : "prompts"}
          </p>
          {activeFilters.length > 0 && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-violet-400">
              <Filter className="size-3" /> {activeFilters.length} active
            </span>
          )}
        </div>

        {status === "failed" && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-400/15 bg-red-500/[.05] p-4 text-sm text-red-200">
            <span className="flex items-center gap-2"><AlertTriangle className="size-4" />{error}</span>
            <Button variant="secondary" size="sm" onClick={() => void dispatch(fetchMyPrompts())}>
              <RefreshCw className="size-3.5" /> Retry
            </Button>
          </div>
        )}

        <div className="mt-3 space-y-2.5">
          <div className="hidden grid-cols-[minmax(0,1fr)_130px_100px_145px_40px] gap-5 px-5 pb-1 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-700 md:grid">
            <span>Prompt</span><span>Visibility</span><span>Version</span><span>Activity</span><span />
          </div>
          {status === "loading" && Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl border border-white/[.06] bg-white/[.025]" />
          ))}
          {status === "succeeded" && filteredPrompts.map((prompt) => (
            <PromptListItem key={prompt.id} prompt={prompt} onAction={onAction} onOpen={onOpenPrompt} onEdit={onEditPrompt} onVisibilityChange={(promptId, visibility) => { void dispatch(updatePromptVisibility({ promptId, visibility })).unwrap().then(() => onAction(`Prompt visibility changed to ${visibility}`)).catch(() => undefined); }} />
          ))}
        </div>

        {status === "succeeded" && filteredPrompts.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-white/[.09] py-16 text-center">
            <span className="mx-auto grid size-10 place-items-center rounded-lg bg-white/[.035] text-slate-600">
              <FileText className="size-[18px]" />
            </span>
            <h2 className="mt-4 text-sm font-medium text-slate-300">No prompts found</h2>
            <p className="mt-1.5 text-xs text-slate-600">
              {prompts.length ? "Try adjusting your search or filters." : "Create your first prompt to start building your library."}
            </p>
            <Button variant="secondary" size="sm" className="mt-5" onClick={() => { setQuery(""); setActiveFilters([]); }}>
              Reset filters
            </Button>
          </div>
        )}

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub. Crafted for better prompting.</p>
          <p>{prompts.length} prompts in your personal workspace</p>
        </footer>
      </div>
    </>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1.5 text-[11px] font-medium transition",
        active
          ? "border-violet-500/45 bg-violet-500/10 text-violet-300"
          : "border-white/[.07] bg-white/[.025] text-slate-500 hover:border-white/[.13] hover:text-slate-300",
      )}
    >
      {label}
    </button>
  );
}
