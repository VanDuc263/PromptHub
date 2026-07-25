import { Compass, SearchX, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CopyPromptDialog } from "@/components/explore/copy-prompt-dialog";
import { ExploreHeader } from "@/components/explore/explore-header";
import {
  FilterBar,
  type ExploreFilters,
} from "@/components/explore/filter-bar";
import {
  ExploreLeftSidebar,
  ExploreRightSidebar,
} from "@/components/explore/explore-sidebars";
import {
  MarketplaceCard,
  MarketplaceCardSkeleton,
} from "@/components/explore/marketplace-card";
import { TrendingCarousel } from "@/components/explore/trending-carousel";
import { Button } from "@/components/ui/button";
import { communityPrompts, defaultExploreFilters } from "@/data/explore-data";
import type { ExplorePrompt } from "@/types";

export function ExplorePage({
  onAction,
}: {
  onAction: (label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<ExploreFilters>(defaultExploreFilters);
  const [visibleCount, setVisibleCount] = useState(6);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<ExplorePrompt | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => setInitialLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredPrompts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = communityPrompts.filter((prompt) => {
      const matchesQuery =
        !normalizedQuery ||
        `${prompt.title} ${prompt.description} ${prompt.category} ${prompt.tags.join(" ")} ${prompt.author}`
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesCategory =
        filters.category === "All" || prompt.category === filters.category;
      const matchesModel =
        filters.model === "All models" || prompt.models.includes(filters.model);
      return matchesQuery && matchesCategory && matchesModel;
    });

    return [...results].sort((a, b) => {
      if (filters.sort === "Newest") return a.id > b.id ? -1 : 1;
      if (filters.sort === "Most Copied") return b.copies - a.copies;
      if (filters.sort === "Highest Rated") return b.rating - a.rating;
      if (filters.sort === "Most Saved") return b.bookmarks - a.bookmarks;
      return b.copies + b.likes - (a.copies + a.likes);
    });
  }, [filters, query]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || loadingMore || visibleCount >= filteredPrompts.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setLoadingMore(true);
        window.setTimeout(() => {
          setVisibleCount((count) => Math.min(count + 4, filteredPrompts.length));
          setLoadingMore(false);
        }, 550);
      },
      { rootMargin: "240px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredPrompts.length, loadingMore, visibleCount]);

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    setVisibleCount(6);
  };

  const updateFilters = (nextFilters: ExploreFilters) => {
    setFilters(nextFilters);
    setVisibleCount(6);
  };

  const openCopyDialog = (prompt: ExplorePrompt) => {
    setSelectedPrompt(prompt);
    setCopyOpen(true);
  };

  const openPrompt = (prompt: ExplorePrompt) => {
    onAction(`Community prompt opened: ${prompt.title}`);
  };

  return (
    <>
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <ExploreHeader query={query} onQueryChange={updateQuery} />
        <div className="mt-6"><FilterBar filters={filters} onChange={updateFilters} /></div>
        <div className="mt-8"><TrendingCarousel onOpen={(id) => openPrompt(communityPrompts.find((prompt) => prompt.id === id)!)} /></div>

        <div className="mt-9 grid min-w-0 gap-5 lg:grid-cols-[180px_minmax(0,1fr)] 2xl:grid-cols-[180px_minmax(0,1fr)_260px]">
          <ExploreLeftSidebar
            activeCategory={filters.category}
            activeSort={filters.sort}
            onCategoryChange={(category) => updateFilters({ ...filters, category })}
            onSortChange={(sort) => updateFilters({ ...filters, sort })}
            onAction={onAction}
          />

          <main className="min-w-0">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-700">Marketplace</p>
                <h2 className="mt-1.5 text-base font-semibold text-slate-100">
                  {filters.category === "All" ? "Community prompts" : filters.category}
                </h2>
              </div>
              <p className="text-[10px] text-slate-700">{filteredPrompts.length} prompts</p>
            </div>

            {initialLoading ? (
              <div className="columns-1 gap-3 xl:columns-2 2xl:columns-2 min-[1700px]:columns-3">
                {Array.from({ length: 6 }, (_, index) => <MarketplaceCardSkeleton key={index} />)}
              </div>
            ) : filteredPrompts.length === 0 ? (
              <ExploreEmptyState
                onReset={() => {
                  updateQuery("");
                  updateFilters(defaultExploreFilters);
                }}
              />
            ) : (
              <>
                <motion.div layout className="columns-1 gap-3 xl:columns-2 2xl:columns-2 min-[1700px]:columns-3">
                  {filteredPrompts.slice(0, visibleCount).map((prompt) => (
                    <MarketplaceCard
                      key={prompt.id}
                      prompt={prompt}
                      onOpen={() => openPrompt(prompt)}
                      onCopy={() => openCopyDialog(prompt)}
                      onAction={onAction}
                    />
                  ))}
                  {loadingMore && Array.from({ length: 2 }, (_, index) => <MarketplaceCardSkeleton key={`loading-${index}`} />)}
                </motion.div>
                <div ref={loadMoreRef} className="flex h-16 items-center justify-center">
                  {visibleCount >= filteredPrompts.length && (
                    <span className="inline-flex items-center gap-1.5 text-[9px] text-slate-800">
                      <Sparkles className="size-3" /> You’ve reached the end
                    </span>
                  )}
                </div>
              </>
            )}
          </main>

          <ExploreRightSidebar
            onTag={updateQuery}
            onAction={onAction}
          />
        </div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub Community.</p>
          <p>Discover better prompts. Build better outcomes.</p>
        </footer>
      </div>

      <CopyPromptDialog
        prompt={selectedPrompt}
        open={copyOpen}
        onOpenChange={setCopyOpen}
        onOpenPrompt={() => selectedPrompt && openPrompt(selectedPrompt)}
        onAction={onAction}
      />
    </>
  );
}

function ExploreEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-dashed border-white/[.09] bg-[#161b22]/50 px-6 py-16 text-center">
      <div className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-emerald-500/10 bg-emerald-500/[.04]">
        <Compass className="size-7 text-emerald-400/60" />
        <SearchX className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#161b22] p-1 text-slate-500" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-300">No prompts found</h3>
      <p className="mt-2 text-sm text-slate-600">Try changing your filters or search keyword.</p>
      <Button variant="secondary" className="mt-6" onClick={onReset}>Reset search and filters</Button>
    </motion.div>
  );
}
