import {
  Bookmark,
  Copy,
  Eye,
  GitFork,
  Heart,
  Star,
  Tag,
  UserRound,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  authorStats,
  relatedPrompts,
} from "@/data/public-prompt-data";
import { formatCompact } from "@/lib/utils";
import { usePublicPromptData } from "@/context/public-prompt-context";
import { PersonalPromptReview } from "@/components/prompt-detail/prompt-feedback-sections";

export function PublicPromptSidebar({
  promptId,
  onAction,
}: {
  promptId: string | null;
  onAction: (label: string) => void;
}) {
  const { prompt: publicPrompt, stats: publicStats } = usePublicPromptData();
  return (
    <aside className="space-y-4 xl:sticky xl:top-[152px] xl:self-start">
      <Panel>
        <div className="flex items-center">
          <Avatar initials={publicPrompt.authorInitials} className="size-11 text-xs" />
          <div className="ml-3 min-w-0">
            <p className="truncate text-xs font-semibold text-slate-200">{publicPrompt.author}</p>
            <p className="mt-1 text-[9px] text-slate-700">{publicPrompt.username}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-sky-400"><span className="size-1.5 rounded-full bg-sky-400" /> Verified</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <AuthorMetric value={formatCompact(authorStats.followers)} label="Followers" />
          <AuthorMetric value={String(authorStats.publicPrompts)} label="Prompts" />
          <AuthorMetric value={String(authorStats.averageRating)} label="Rating" />
        </div>
        <p className="mt-3 text-center text-[9px] text-slate-700">{authorStats.joinedAt}</p>
        <Button variant="secondary" className="mt-4 w-full" onClick={() => onAction(`${publicPrompt.author}'s profile opened`)}><UserRound className="size-4" /> View profile</Button>
      </Panel>

      <Panel title="Statistics">
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Eye} value={publicStats.views} label="Views" />
          <Stat icon={Copy} value={publicStats.copies} label="Copies" />
          <Stat icon={GitFork} value={publicStats.forks} label="Forks" />
          <Stat icon={Bookmark} value={publicStats.saves} label="Saves" />
          <Stat icon={Heart} value={publicStats.likes} label="Likes" />
          <Stat icon={Star} value={publicStats.rating} label="Avg. rating" decimal />
        </div>
      </Panel>

      <Panel title="Community tags">
        <div className="flex flex-wrap gap-1.5">{publicPrompt.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
      </Panel>

      {promptId && <PersonalPromptReview promptId={promptId} onAction={onAction} />}

      <Panel title="Related prompts">
        {relatedPrompts.length ? (
          <div className="space-y-2">
            {relatedPrompts.map((prompt) => (
              <button type="button" key={prompt.title} onClick={() => onAction(`Related prompt opened: ${prompt.title}`)} className="w-full rounded-lg border border-white/[.055] bg-white/[.02] p-3 text-left transition hover:border-emerald-500/20">
                <p className="text-[10px] font-medium text-slate-300">{prompt.title}</p>
                <div className="mt-2 flex items-center text-[8px] text-slate-700">
                  <span>{prompt.category}</span><span className="mx-1.5">·</span><span>{prompt.author}</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-amber-400"><Star className="size-2.5 fill-current" />{prompt.rating}</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center"><Tag className="mx-auto size-5 text-slate-700" /><p className="mt-2 text-[10px] text-slate-700">No related prompts yet.</p></div>
        )}
      </Panel>
    </aside>
  );
}

function Panel({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4">
      {title && <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-600">{title}</h2>}
      {children}
    </section>
  );
}

function AuthorMetric({ value, label }: { value: string; label: string }) {
  return <div className="rounded-lg bg-white/[.025] py-2"><p className="text-xs font-semibold text-slate-300">{value}</p><p className="mt-1 text-[8px] text-slate-700">{label}</p></div>;
}

function Stat({ icon: Icon, value, label, decimal }: { icon: typeof Eye; value: number; label: string; decimal?: boolean }) {
  return (
    <div className="rounded-lg border border-white/[.055] bg-[#0d1117]/55 p-3">
      <Icon className="size-3.5 text-emerald-400" />
      <p className="mt-2 text-sm font-semibold text-slate-200">{decimal ? value.toFixed(1) : formatCompact(value)}</p>
      <p className="mt-1 text-[8px] text-slate-700">{label}</p>
    </div>
  );
}
