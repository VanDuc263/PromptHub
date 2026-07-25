import { Bookmark } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/utils";
import { savedKeyForTitle } from "@/data/saved-data";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import type { TrendingPrompt } from "@/types";

export function TrendingCard({
  prompt,
  onAction,
}: {
  prompt: TrendingPrompt;
  onAction: (label: string) => void;
}) {
  const savedId = savedKeyForTitle(prompt.title);
  const { isSaved, toggleSaved } = useSavedPrompts();
  const saved = isSaved(savedId);
  const toggleSave = () => {
    const willSave = toggleSaved(savedId);
    onAction(willSave ? `Saved ${prompt.title}` : `Removed ${prompt.title} from Saved`);
  };

  return (
    <article className="min-w-[292px] flex-1 rounded-xl border border-white/[.07] bg-[#161b22] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/[.13] sm:min-w-[330px]">
      <div className="flex items-start gap-3">
        <span className="font-mono text-xs font-semibold text-violet-400">#{prompt.rank}</span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-100">{prompt.title}</h3>
          <p className="mt-1 text-[11px] text-slate-600">{prompt.category}</p>
        </div>
        <Button variant="icon" size="icon" className="size-8" onClick={toggleSave} aria-label={saved ? "Unsave prompt" : "Save prompt"}>
          <Bookmark className={`size-4 ${saved ? "fill-violet-400 text-violet-400" : ""}`} />
        </Button>
      </div>
      <div className="mt-5 flex items-center">
        <Avatar initials={prompt.initials} className="size-7 text-[9px]" />
        <span className="ml-2 text-[11px] text-slate-500">by <strong className="font-medium text-slate-300">{prompt.author}</strong></span>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-slate-600">
          <span>{formatCompact(prompt.uses)} uses</span>
          <span className="inline-flex items-center gap-1"><Bookmark className="size-3.5" />{prompt.saves}</span>
        </div>
      </div>
    </article>
  );
}
