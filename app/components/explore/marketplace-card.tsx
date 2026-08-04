import {
  Bookmark,
  Copy,
  Eye,
  FolderPlus,
  Globe2,
  Heart,
  Star,
  Variable,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptCover } from "@/components/explore/prompt-cover";
import { cn, formatCompact } from "@/lib/utils";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import type { ExplorePrompt } from "@/types";

export function MarketplaceCard({
  prompt,
  onOpen,
  onCopy,
  onAction,
}: {
  prompt: ExplorePrompt;
  onOpen: () => void;
  onCopy: () => void;
  onAction: (label: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const savedId = String(prompt.id);
  const { isSaved, toggleSaved } = useSavedPrompts();
  const bookmarked = isSaved(savedId);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ duration: 0.2 }}
      className="group mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22] shadow-sm transition-shadow hover:border-emerald-500/25 hover:shadow-[0_20px_48px_rgba(0,0,0,.22)]"
    >
      <PromptCover prompt={prompt} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge>{prompt.category}</Badge>
              <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-amber-400"><Star className="size-3 fill-current" /> {prompt.rating}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-5 text-slate-100 transition group-hover:text-emerald-200">{prompt.title}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-500">{prompt.description}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {prompt.tags.slice(0, 3).map((tag) => <Badge key={tag} className="py-0.5 text-[9px]">{tag}</Badge>)}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          {prompt.models.map((model) => (
            <span key={model} className="rounded-md border border-emerald-500/10 bg-emerald-500/[.04] px-1.5 py-1 text-[9px] text-emerald-300/70">{model}</span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-slate-700"><Globe2 className="size-3" /> {prompt.visibility}</span>
        </div>

        <div className="mt-4 flex items-center border-t border-white/[.06] pt-3">
          <Avatar initials={prompt.authorInitials} className="size-7 text-[9px]" />
          <div className="ml-2 min-w-0">
            <p className="truncate text-[10px] font-medium text-slate-300">{prompt.author}</p>
            <p className="mt-0.5 text-[9px] text-slate-700">{prompt.createdAt}</p>
          </div>
          <div className="ml-auto flex items-center gap-2.5 text-[9px] text-slate-600">
            <span className="inline-flex items-center gap-1"><Copy className="size-3" />{formatCompact(prompt.copies)}</span>
            <span className="inline-flex items-center gap-1"><Heart className="size-3" />{formatCompact(prompt.likes + (liked ? 1 : 0))}</span>
            <span className="inline-flex items-center gap-1"><Bookmark className="size-3" />{formatCompact(prompt.saves + (bookmarked ? 1 : 0))}</span>
          </div>
        </div>

        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-200 group-hover:mt-4 group-hover:max-h-52 group-hover:opacity-100 group-focus-within:mt-4 group-focus-within:max-h-52 group-focus-within:opacity-100">
          <div className="rounded-lg border border-white/[.06] bg-[#0d1117]/75 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-700">Prompt preview</p>
            <p className="mt-2 font-mono text-[10px] leading-5 text-slate-500">{prompt.snippet}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <Variable className="mr-1 size-3 text-violet-400" />
              {prompt.variables.map((variable) => <code key={variable} className="rounded bg-violet-500/[.07] px-1.5 py-0.5 text-[9px] text-violet-300">{`{{${variable}}}`}</code>)}
            </div>
          </div>
        </div>

        <div className="mt-3 flex translate-y-1 flex-wrap gap-1 opacity-100 transition duration-200 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
          <Button variant="ghost" size="sm" onClick={onOpen}><Eye className="size-3.5" /> View</Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const willSave = toggleSaved(savedId);
              onAction(willSave ? "Prompt saved" : "Removed from Saved");
            }}
            aria-label={bookmarked ? "Remove from Saved" : "Save prompt"}
          >
            <Bookmark className={cn("size-3.5", bookmarked && "fill-emerald-400 text-emerald-400")} />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Add to Collection" onClick={() => onAction(`Add ${prompt.title} to collection`)}>
            <FolderPlus className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLiked((value) => !value);
              onAction(liked ? "Like removed" : "Prompt liked");
            }}
            aria-label={liked ? "Unlike prompt" : "Like prompt"}
          >
            <Heart className={cn("size-3.5", liked && "fill-rose-400 text-rose-400")} />
          </Button>
          <Button size="sm" className="ml-auto bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={onCopy}>
            <Copy className="size-3.5" /> Copy prompt
          </Button>
        </div>
        <p className="mt-3 text-right font-mono text-[8px] text-slate-800">~{prompt.tokens.toLocaleString()} tokens</p>
      </div>
    </motion.article>
  );
}

export function MarketplaceCardSkeleton() {
  return (
    <div className="mb-3 break-inside-avoid animate-pulse overflow-hidden rounded-2xl border border-white/[.06] bg-[#161b22]">
      <div className="h-28 bg-white/[.025]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-2/3 rounded bg-white/[.05]" />
        <div className="h-2 w-full rounded bg-white/[.04]" />
        <div className="h-2 w-5/6 rounded bg-white/[.04]" />
        <div className="h-8 rounded bg-white/[.025]" />
      </div>
    </div>
  );
}
