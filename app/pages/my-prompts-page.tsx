import {
  ChevronDown,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { NewPromptDialog } from "@/components/prompts/new-prompt-dialog";
import { PromptListItem } from "@/components/prompts/prompt-list-item";
import { Button } from "@/components/ui/button";
import { libraryPrompts } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const categoryFilters = ["Programming", "Marketing", "English"] as const;
const stateFilters = ["Private", "Public", "Draft"] as const;

export function MyPromptsPage({ onAction }: { onAction: (label: string) => void }) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [newPromptOpen, setNewPromptOpen] = useState(false);
  const [sortNewest, setSortNewest] = useState(true);

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

    const results = libraryPrompts.filter((prompt) => {
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
  }, [activeFilters, query, sortNewest]);

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-violet-400">
              Library
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-[-.03em] text-slate-50 sm:text-3xl">
              My Prompts
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create, refine, and manage every prompt in your library.
            </p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => setNewPromptOpen(true)}>
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

        <div className="mt-3 space-y-2.5">
          <div className="hidden grid-cols-[minmax(0,1fr)_130px_100px_145px_40px] gap-5 px-5 pb-1 text-[10px] font-semibold uppercase tracking-[.12em] text-slate-700 md:grid">
            <span>Prompt</span><span>Visibility</span><span>Version</span><span>Activity</span><span />
          </div>
          {filteredPrompts.map((prompt) => (
            <PromptListItem key={prompt.id} prompt={prompt} onAction={onAction} />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="mt-3 rounded-xl border border-dashed border-white/[.09] py-16 text-center">
            <span className="mx-auto grid size-10 place-items-center rounded-lg bg-white/[.035] text-slate-600">
              <FileText className="size-[18px]" />
            </span>
            <h2 className="mt-4 text-sm font-medium text-slate-300">No prompts found</h2>
            <p className="mt-1.5 text-xs text-slate-600">Try adjusting your search or filters.</p>
            <Button variant="secondary" size="sm" className="mt-5" onClick={() => { setQuery(""); setActiveFilters([]); }}>
              Reset filters
            </Button>
          </div>
        )}

        <footer className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub. Crafted for better prompting.</p>
          <p>{libraryPrompts.length} prompts in your personal workspace</p>
        </footer>
      </div>

      <NewPromptDialog
        open={newPromptOpen}
        onOpenChange={setNewPromptOpen}
        onCreate={(title) => onAction(`${title} created as a draft`)}
      />
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
