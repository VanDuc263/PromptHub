import { AlertTriangle, Bookmark, FileText, RefreshCw, Sparkles, Users } from "lucide-react";
import { useEffect, useMemo } from "react";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { HeroSection } from "@/components/dashboard/hero-section";
import { PromptCard } from "@/components/dashboard/prompt-card";
import { QuickActionCard } from "@/components/dashboard/quick-action-card";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { StatisticCard } from "@/components/dashboard/statistic-card";
import { TrendingCard } from "@/components/dashboard/trending-card";
import { Button } from "@/components/ui/button";
import { quickActions } from "@/data/mock-data";
import { useHistory } from "@/hooks/use-history";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchExplorePrompts } from "@/store/explore-slice";
import { fetchMyPrompts } from "@/store/my-prompts-slice";
import { fetchSavedPrompts } from "@/store/saved-prompts-slice";
import type { Activity, Prompt, Statistic, TrendingPrompt } from "@/types";

type HomeDestination = "My prompts" | "Explore" | "Collections" | "History" | "Create prompt";

const accents: Record<string, string> = {
  Programming: "bg-cyan-400",
  Marketing: "bg-fuchsia-400",
  English: "bg-amber-400",
  Other: "bg-violet-400",
};

const activityTones = [
  "bg-violet-500/15 text-violet-300",
  "bg-sky-500/15 text-sky-300",
  "bg-emerald-500/15 text-emerald-300",
  "bg-amber-500/15 text-amber-300",
];

function relativeTime(value: string | number) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "Just now";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(value).toLocaleDateString();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length ? `${parts[0][0]}${parts.length > 1 ? parts.at(-1)?.[0] : ""}`.toUpperCase() : "PH";
}

export function HomePage({
  onAction,
  onNavigate,
  onOpenPublicPrompt,
}: {
  onAction: (label: string) => void;
  onNavigate: (destination: HomeDestination) => void;
  onOpenPublicPrompt: (promptId: string) => void;
}) {
  const dispatch = useAppDispatch();
  const { records } = useHistory();
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const myPromptsState = useAppSelector((state) => state.myPrompts);
  const savedPromptsState = useAppSelector((state) => state.savedPrompts);
  const exploreState = useAppSelector((state) => state.explore);

  useEffect(() => {
    if (exploreState.status === "idle") void dispatch(fetchExplorePrompts());
    if (accessToken && myPromptsState.status === "idle") void dispatch(fetchMyPrompts());
    if (accessToken && savedPromptsState.status === "idle") void dispatch(fetchSavedPrompts());
  }, [accessToken, dispatch, exploreState.status, myPromptsState.status, savedPromptsState.status]);

  const recentPrompts = useMemo<Prompt[]>(() => exploreState.prompts.slice(0, 4).map((prompt) => ({
    id: prompt.id,
    title: prompt.title,
    description: prompt.description,
    tags: prompt.tags,
    visibility: "Public",
    version: prompt.models[0] ?? "Any model",
    updatedAt: prompt.publishedAt ? relativeTime(prompt.publishedAt) : "Recently",
    uses: prompt.copies,
    saves: prompt.saves,
    accent: accents[prompt.category] ?? accents.Other,
  })), [exploreState.prompts]);

  const trendingPrompts = useMemo<TrendingPrompt[]>(() => [...exploreState.prompts]
    .sort((left, right) => (right.copies + right.saves) - (left.copies + left.saves))
    .slice(0, 3)
    .map((prompt, index) => ({
      rank: index + 1,
      title: prompt.title,
      author: prompt.author,
      initials: prompt.authorInitials,
      category: prompt.category,
      uses: prompt.copies,
      saves: prompt.saves,
    })), [exploreState.prompts]);

  const statistics = useMemo<Statistic[]>(() => {
    const mine = myPromptsState.prompts;
    return [
      { title: "Total prompts", value: String(mine.length), change: "In your library", positive: true, icon: FileText },
      { title: "Public prompts", value: String(mine.filter((prompt) => prompt.visibility === "Public").length), change: "Shared with community", positive: true, icon: Users },
      { title: "Saved", value: String(savedPromptsState.prompts.length), change: "From the community", positive: true, icon: Bookmark },
      { title: "Total uses", value: mine.reduce((total, prompt) => total + prompt.uses, 0).toLocaleString(), change: "Across your prompts", positive: true, icon: Sparkles },
    ];
  }, [myPromptsState.prompts, savedPromptsState.prompts.length]);

  const activities = useMemo<Activity[]>(() => records.slice(0, 4).map((record, index) => ({
    id: index + 1,
    actor: "You",
    action: record.type.toLowerCase(),
    target: record.title,
    time: relativeTime(record.createdAt),
    initials: initials(user?.displayName ?? user?.username ?? "You"),
    tone: activityTones[index % activityTones.length],
  })), [records, user]);

  const errors = [myPromptsState.error, savedPromptsState.error, exploreState.error].filter(Boolean);
  const loadingPrivateData = Boolean(accessToken) && (myPromptsState.status === "idle" || myPromptsState.status === "loading");
  const loadingTrending = exploreState.status === "idle" || exploreState.status === "loading";
  const quickDestinations: HomeDestination[] = ["Create prompt", "Explore", "Collections"];

  const retry = () => {
    if (exploreState.status === "failed") void dispatch(fetchExplorePrompts());
    if (accessToken && myPromptsState.status === "failed") void dispatch(fetchMyPrompts());
    if (accessToken && savedPromptsState.status === "failed") void dispatch(fetchSavedPrompts());
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <HeroSection name={user?.displayName ?? user?.username} onCreatePrompt={() => onNavigate("Create prompt")} onExplore={() => onNavigate("Explore")} />

      {errors.length > 0 && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-amber-400/15 bg-amber-500/[.05] p-4 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><AlertTriangle className="size-4 shrink-0" />{errors[0]}</span>
          <Button variant="secondary" size="sm" onClick={retry}><RefreshCw className="size-3.5" /> Retry</Button>
        </div>
      )}

      <section>
        <SectionHeading title="Quick actions" />
        <div className="grid gap-3 md:grid-cols-3">
          {quickActions.map((action, index) => <QuickActionCard key={action.title} action={action} onClick={() => onNavigate(quickDestinations[index])} />)}
        </div>
      </section>

      {accessToken && (
        <section>
          <SectionHeading title="Overview" eyebrow="Your workspace" />
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {loadingPrivateData ? Array.from({ length: 4 }, (_, index) => <div key={index} className="h-32 animate-pulse rounded-xl border border-white/[.06] bg-white/[.025]" />) : statistics.map((statistic) => <StatisticCard key={statistic.title} statistic={statistic} />)}
          </div>
        </section>
      )}

      <section>
        <SectionHeading title="Recent prompts" action="View all" onAction={() => onNavigate("Explore")} />
        {loadingTrending ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-[236px] animate-pulse rounded-xl border border-white/[.06] bg-white/[.025]" />)}</div>
        ) : recentPrompts.length ? (
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">{recentPrompts.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} onAction={onAction} onOpen={() => onOpenPublicPrompt(String(prompt.id))} />)}</div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/[.09] py-10 text-center text-sm text-slate-500">No community prompts are available yet.</div>
        )}
      </section>

      <div className="grid gap-8 2xl:grid-cols-[minmax(0,1fr)_350px]">
        <section className="min-w-0">
          <SectionHeading title="Trending" action="Explore all" onAction={() => onNavigate("Explore")} />
          {loadingTrending ? (
            <div className="flex gap-3 overflow-hidden">{Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 min-w-[292px] flex-1 animate-pulse rounded-xl border border-white/[.06] bg-white/[.025]" />)}</div>
          ) : trendingPrompts.length ? (
            <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">{trendingPrompts.map((prompt, index) => <TrendingCard key={prompt.rank} prompt={prompt} onAction={onAction} onOpen={() => onOpenPublicPrompt(exploreState.prompts.find((item) => item.title === prompt.title)?.id ?? String(index))} />)}</div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/[.09] py-10 text-center text-sm text-slate-500">No community prompts are available yet.</div>
          )}
        </section>

        {accessToken && (
          <section>
            <SectionHeading title="Recent activity" action="View all" onAction={() => onNavigate("History")} />
            <div className="rounded-xl border border-white/[.07] bg-[#161b22] px-5 pb-1 pt-5">
              {activities.length ? activities.map((activity, index) => <ActivityItem key={activity.id} activity={activity} isLast={index === activities.length - 1} />) : <p className="pb-5 text-sm text-slate-500">No recent activity.</p>}
            </div>
          </section>
        )}
      </div>

      <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
        <p>© 2026 PromptHub. Crafted for better prompting.</p>
        <div className="flex gap-5"><button className="hover:text-slate-500">Help</button><button className="hover:text-slate-500">Changelog</button><button className="hover:text-slate-500">Privacy</button></div>
      </footer>
    </div>
  );
}
