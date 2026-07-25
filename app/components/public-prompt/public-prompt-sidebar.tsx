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
  publicPrompt,
  publicStats,
  relatedPrompts,
} from "@/data/public-prompt-data";
import { formatCompact } from "@/lib/utils";

export function PublicPromptSidebar({
  userRating,
  onRatingChange,
  onAction,
}: {
  userRating: number;
  onRatingChange: (rating: number) => void;
  onAction: (label: string) => void;
}) {
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
          <Stat icon={Bookmark} value={publicStats.bookmarks} label="Bookmarks" />
          <Stat icon={Heart} value={publicStats.likes} label="Likes" />
          <Stat icon={Star} value={publicStats.rating} label="Avg. rating" decimal />
        </div>
      </Panel>

      <Panel title="Community tags">
        <div className="flex flex-wrap gap-1.5">{publicPrompt.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
      </Panel>

      <RatingPanel userRating={userRating} onRatingChange={onRatingChange} />

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

function RatingPanel({ userRating, onRatingChange }: { userRating: number; onRatingChange: (rating: number) => void }) {
  const distribution = [
    { stars: 5, value: 76 },
    { stars: 4, value: 18 },
    { stars: 3, value: 4 },
    { stars: 2, value: 1 },
    { stars: 1, value: 1 },
  ];
  return (
    <Panel title="Community rating">
      <div className="flex items-end gap-2">
        <span className="text-3xl font-semibold tracking-[-.04em] text-slate-100">4.8</span>
        <span className="mb-1 text-[9px] text-slate-700">846 ratings</span>
      </div>
      <div className="mt-4 space-y-1.5">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-2">
            <span className="w-3 text-[8px] text-slate-600">{item.stars}</span>
            <Star className="size-2.5 fill-amber-400 text-amber-400" />
            <div className="h-1 flex-1 overflow-hidden rounded bg-white/[.05]">
              <div className={`h-full rounded bg-amber-400/70 ${ratingWidth(item.value)}`} />
            </div>
            <span className="w-5 text-right text-[8px] text-slate-700">{item.value}%</span>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t border-white/[.06] pt-4">
        <p className="text-[9px] text-slate-600">Rate this prompt</p>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button type="button" key={rating} onClick={() => onRatingChange(rating)} aria-label={`Rate ${rating} stars`} className="text-slate-700 transition hover:scale-110 hover:text-amber-400">
              <Star className={`size-5 ${rating <= userRating ? "fill-amber-400 text-amber-400" : ""}`} />
            </button>
          ))}
        </div>
        {userRating > 0 && <p className="mt-2 text-[9px] text-emerald-400">Thanks for your {userRating}-star rating.</p>}
      </div>
    </Panel>
  );
}

function ratingWidth(value: number) {
  if (value >= 75) return "w-3/4";
  if (value >= 50) return "w-1/2";
  if (value >= 25) return "w-1/4";
  if (value >= 10) return "w-[12%]";
  return "w-[4%]";
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
