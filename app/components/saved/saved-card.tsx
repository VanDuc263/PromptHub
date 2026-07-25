import { BookmarkX, Check, Copy, ExternalLink, GitFork, FolderPlus, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SavedPrompt } from "@/types";

function compact(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : `${value}`;
}

export function SavedCard({
  prompt,
  selected,
  list,
  onSelect,
  onRemove,
  onAction,
}: {
  prompt: SavedPrompt;
  selected: boolean;
  list: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onAction: (label: string) => void;
}) {
  const Icon = prompt.icon;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative flex min-w-0 flex-col rounded-2xl border bg-[#161b22] p-4 shadow-lg shadow-black/5 transition hover:border-white/[.14] hover:shadow-black/20",
        selected ? "border-emerald-500/45 ring-1 ring-emerald-500/15" : "border-white/[.07]",
        list && "sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-label={selected ? `Deselect ${prompt.title}` : `Select ${prompt.title}`}
        className={cn(
          "absolute right-3 top-3 grid size-6 place-items-center rounded-md border transition",
          selected ? "border-emerald-400 bg-emerald-500 text-[#07120b]" : "border-white/10 bg-[#0d1117] text-transparent hover:border-white/25",
        )}
      >
        <Check className="size-3.5" />
      </button>

      <div className="min-w-0 pr-8">
        <div className="flex items-center gap-3">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", prompt.accent)}>
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-100">{prompt.title}</h2>
            <p className="mt-0.5 text-[10px] text-slate-600">by {prompt.author}</p>
          </div>
        </div>
        <p className="mt-4 line-clamp-2 text-xs leading-5 text-slate-500">{prompt.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/[.08] bg-white/[.03] px-2 py-1 text-[9px] text-slate-400">{prompt.category}</span>
          {prompt.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-emerald-500/[.06] px-2 py-1 text-[9px] text-emerald-400/80">{tag}</span>)}
          {prompt.models.slice(0, 2).map((model) => <span key={model} className="rounded-full bg-violet-500/[.07] px-2 py-1 text-[9px] text-violet-300">{model}</span>)}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/[.06] pt-3 text-[10px] text-slate-600">
          <span className="inline-flex items-center gap-1"><Star className="size-3 text-amber-400" /> {prompt.rating.toFixed(1)}</span>
          <span>{compact(prompt.copies)} copies</span>
          <span><GitFork className="mr-1 inline size-3" />{compact(prompt.forks)}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-slate-700">
          <span>{prompt.version}</span>
          <span>{prompt.visibility}</span>
          <span>Saved {prompt.savedAt.toLowerCase()}</span>
          <span>Updated {prompt.updatedAt.toLowerCase()}</span>
        </div>
      </div>

      <div className={cn("mt-4 flex flex-wrap gap-2 border-t border-white/[.06] pt-3", list && "sm:mt-0 sm:w-36 sm:flex-col sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0")}>
        <Button size="sm" className="flex-1 bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => onAction(`Opened ${prompt.title}`)}><ExternalLink className="size-3.5" /> Open</Button>
        <Button size="sm" variant="secondary" onClick={() => onAction(`${prompt.title} copied`)}><Copy className="size-3.5" /> Copy</Button>
        <Button size="sm" variant="secondary" onClick={() => onAction(`${prompt.title} forked`)}><GitFork className="size-3.5" /> Fork</Button>
        <Button size="sm" variant="ghost" onClick={() => onAction(`Add ${prompt.title} to collection`)}><FolderPlus className="size-3.5" /> Collection</Button>
        <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300" onClick={onRemove}><BookmarkX className="size-3.5" /> Remove</Button>
      </div>
    </motion.article>
  );
}
