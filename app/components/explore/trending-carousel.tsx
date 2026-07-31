import { Bookmark, Copy, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PromptCover } from "@/components/explore/prompt-cover";
import { savedKeyForTitle } from "@/data/saved-data";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import { formatCompact } from "@/lib/utils";
import type { ExplorePrompt } from "@/types";

export function TrendingCarousel({
  onOpen,
  prompts,
}: {
  onOpen: (promptId: string | number) => void;
  prompts: ExplorePrompt[];
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-emerald-400">Popular this week</p>
          <h2 className="mt-1.5 text-base font-semibold text-slate-100">Trending prompts</h2>
        </div>
        <p className="text-[10px] text-slate-700">Scroll to explore →</p>
      </div>
      <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {prompts.filter((prompt) => prompt.featured).map((prompt, index) => (
          <FeaturedPromptCard key={prompt.id} prompt={prompt} index={index} onOpen={() => onOpen(prompt.id)} />
        ))}
      </div>
    </section>
  );
}

function FeaturedPromptCard({
  prompt,
  index,
  onOpen,
}: {
  prompt: ExplorePrompt;
  index: number;
  onOpen: () => void;
}) {
  const savedId = savedKeyForTitle(prompt.title);
  const { isSaved, toggleSaved } = useSavedPrompts();
  const saved = isSaved(savedId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -3 }}
      className="min-w-[310px] snap-start overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22] shadow-sm transition-shadow hover:border-emerald-500/25 hover:shadow-[0_18px_45px_rgba(0,0,0,.2)] sm:min-w-[390px]"
    >
      <div className="relative">
        <PromptCover prompt={prompt} large />
        <Badge className="absolute left-3 top-3 border-emerald-500/20 bg-[#0d1117]/85 text-emerald-400 backdrop-blur">
          <Star className="mr-1 size-3 fill-current" /> Featured
        </Badge>
        <Button
          variant="icon"
          size="icon"
          onClick={() => toggleSaved(savedId)}
          className="absolute right-3 top-3 bg-[#0d1117]/80 backdrop-blur"
          aria-label={saved ? "Remove from Saved" : "Save prompt"}
        >
          <Bookmark className={`size-4 ${saved ? "fill-emerald-400 text-emerald-400" : ""}`} />
        </Button>
      </div>
      <button type="button" onClick={onOpen} className="w-full p-5 text-left">
        <div className="flex items-center gap-2">
          <Badge>{prompt.models[0]}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-amber-400"><Star className="size-3 fill-current" /> {prompt.rating}</span>
        </div>
        <h3 className="mt-3 text-base font-semibold tracking-[-.015em] text-slate-100">{prompt.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{prompt.description}</p>
        <div className="mt-4 flex items-center">
          <Avatar initials={prompt.authorInitials} className="size-7 text-[9px]" />
          <span className="ml-2 text-[10px] text-slate-500">by <strong className="font-medium text-slate-300">{prompt.author}</strong></span>
          <div className="ml-auto flex gap-3 text-[10px] text-slate-600">
            <span className="inline-flex items-center gap-1"><Copy className="size-3" />{formatCompact(prompt.copies)}</span>
            <span className="inline-flex items-center gap-1"><Heart className="size-3" />{formatCompact(prompt.likes)}</span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}
