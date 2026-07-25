import {
  Bookmark,
  Copy,
  Eye,
  GitFork,
  FolderPlus,
  Heart,
  Layers3,
  Star,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";
import { savedKeyForTitle } from "@/data/saved-data";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import type {
  ProfileAchievement,
  ProfileActivity,
  ProfileCollection,
  ProfilePrompt,
} from "@/types";

export function CreatorPromptCard({
  prompt,
  layout = "grid",
  onAction,
}: {
  prompt: ProfilePrompt;
  layout?: "grid" | "list";
  onAction: (label: string) => void;
}) {
  const savedId = savedKeyForTitle(prompt.title);
  const { isSaved, toggleSaved } = useSavedPrompts();
  const bookmarked = isSaved(savedId);
  const Icon = prompt.icon;
  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      className={cn(
        "group rounded-2xl border border-white/[.07] bg-[#161b22] p-5 transition-shadow hover:border-violet-500/25 hover:shadow-[0_18px_44px_rgba(0,0,0,.18)]",
        layout === "list" && "md:flex md:items-center md:gap-5",
      )}
    >
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", prompt.accent)}><Icon className="size-[18px]" /></span>
      <div className={cn("min-w-0 flex-1", layout === "grid" ? "mt-4" : "mt-4 md:mt-0")}>
        <div className="flex items-center gap-2">
          <Badge>{prompt.category}</Badge>
          <Badge className="border-violet-500/15 bg-violet-500/[.05] font-mono text-violet-300">{prompt.version}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-amber-400"><Star className="size-3 fill-current" />{prompt.rating}</span>
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-100 transition group-hover:text-violet-200">{prompt.title}</h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">{prompt.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">{prompt.tags.map((tag) => <Badge key={tag} className="py-0.5 text-[9px]">{tag}</Badge>)}</div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {prompt.models.map((model) => <span key={model} className="rounded-md border border-white/[.06] px-1.5 py-1 text-[8px] text-slate-600">{model}</span>)}
          <span className="ml-auto text-[8px] text-slate-700">Updated {prompt.updatedAt}</span>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[.06] pt-3 text-[9px] text-slate-600">
          <span className="inline-flex items-center gap-1"><Copy className="size-3" />{formatCompact(prompt.copies)}</span>
          <span className="inline-flex items-center gap-1"><GitFork className="size-3" />{formatCompact(prompt.forks)}</span>
          <span className="inline-flex items-center gap-1"><Heart className="size-3" />{formatCompact(prompt.likes)}</span>
          <span className="inline-flex items-center gap-1"><Bookmark className="size-3" />{formatCompact(prompt.saves)}</span>
        </div>
      </div>
      <div className={cn("flex gap-1", layout === "grid" ? "mt-4" : "mt-4 md:mt-0 md:flex-col")}>
        <Button variant="ghost" size="sm" onClick={() => onAction(`Opened ${prompt.title}`)}><Eye className="size-3.5" /> View</Button>
        <Button variant="ghost" size="sm" onClick={() => onAction(`${prompt.title} copied`)}><Copy className="size-3.5" /></Button>
        <Button variant="ghost" size="sm" onClick={() => onAction(`${prompt.title} forked`)}><GitFork className="size-3.5" /></Button>
        <Button variant="ghost" size="sm" aria-label="Add to Collection" onClick={() => onAction(`Add ${prompt.title} to collection`)}><FolderPlus className="size-3.5" /></Button>
        <Button variant="ghost" size="sm" aria-label={bookmarked ? "Remove from Saved" : "Save prompt"} onClick={() => { const willSave = toggleSaved(savedId); onAction(willSave ? "Prompt saved" : "Removed from Saved"); }}>
          <Bookmark className={cn("size-3.5", bookmarked && "fill-violet-400 text-violet-400")} />
        </Button>
      </div>
    </motion.article>
  );
}

export function CollectionCard({
  collection,
  onAction,
}: {
  collection: ProfileCollection;
  onAction: (label: string) => void;
}) {
  const [following, setFollowing] = useState(false);
  const Icon = collection.icon;
  return (
    <motion.article whileHover={{ y: -2 }} className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22] transition-shadow hover:border-violet-500/25 hover:shadow-xl">
      <div className="relative h-24 border-b border-white/[.06] bg-[#11161d]">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(139,92,246,.22)_1px,transparent_1px)] [background-size:17px_17px]" />
        <span className={cn("absolute left-4 top-4 grid size-10 place-items-center rounded-xl", collection.accent)}><Icon className="size-[18px]" /></span>
        <Badge className="absolute right-3 top-3">Public</Badge>
        <div className="absolute bottom-3 right-3 flex -space-x-2">{["JP", "SB", "SD"].map((label) => <Avatar key={label} initials={label} className="size-6 border-2 border-[#11161d] text-[7px]" />)}</div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-slate-100">{collection.name}</h3>
        <p className="mt-2 min-h-10 text-xs leading-5 text-slate-500">{collection.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">{collection.tags.map((tag) => <Badge key={tag} className="py-0.5 text-[9px]">{tag}</Badge>)}</div>
        <div className="mt-4 flex items-center gap-3 border-t border-white/[.06] pt-3 text-[9px] text-slate-600">
          <span className="inline-flex items-center gap-1"><Layers3 className="size-3" />{collection.prompts} prompts</span>
          <span className="inline-flex items-center gap-1"><Users className="size-3" />{formatCompact(collection.followers)}</span>
          <span className="ml-auto text-slate-700">{collection.updatedAt}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onAction(`${collection.name} opened`)}>Open collection</Button>
          <Button variant="ghost" size="sm" onClick={() => setFollowing((value) => !value)}>{following ? "Following" : "Follow"}</Button>
        </div>
      </div>
    </motion.article>
  );
}

export function ActivityTimeline({
  activities,
  limit,
  onAction,
}: {
  activities: ProfileActivity[];
  limit?: number;
  onAction: (label: string) => void;
}) {
  const shown = limit ? activities.slice(0, limit) : activities;
  if (!shown.length) return <ProfileEmpty title="No activity yet" subtitle="This creator has not shared any public activity." />;
  return (
    <div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5">
      {shown.map((activity, index) => {
        const Icon = activity.icon;
        return (
          <div key={activity.id} className="relative flex gap-3.5 pb-6 last:pb-0">
            {index < shown.length - 1 && <span className="absolute bottom-0 left-[15px] top-8 w-px bg-white/[.07]" />}
            <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full", activity.tone)}><Icon className="size-3.5" /></span>
            <div className="min-w-0">
              <p className="text-xs leading-5 text-slate-500">
                {activity.description}{" "}
                {activity.related && <button type="button" onClick={() => onAction(`Opened ${activity.related}`)} className="font-medium text-slate-300 hover:text-violet-300">“{activity.related}”</button>}
              </p>
              <p className="mt-1 text-[9px] text-slate-700">{activity.timestamp}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AchievementGrid({ achievements }: { achievements: ProfileAchievement[] }) {
  if (!achievements.length) return <ProfileEmpty title="No achievements yet" subtitle="Community achievements will appear here." />;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {achievements.map((achievement) => {
        const Icon = achievement.icon;
        return (
          <article key={achievement.name} className={cn("rounded-xl border border-white/[.07] bg-[#161b22] p-4", achievement.locked && "opacity-45 grayscale")}>
            <span className={cn("grid size-9 place-items-center rounded-lg", achievement.tone)}><Icon className="size-4" /></span>
            <h3 className="mt-3 text-xs font-semibold text-slate-300">{achievement.name}</h3>
            <p className="mt-1.5 text-[10px] leading-4 text-slate-600">{achievement.description}</p>
            <p className="mt-3 text-[8px] text-slate-700">{achievement.earnedAt}</p>
          </article>
        );
      })}
    </div>
  );
}

export function ProfileEmpty({ title, subtitle }: { title: string; subtitle: string }) {
  return <div className="rounded-2xl border border-dashed border-white/[.08] py-14 text-center"><FileCode2Icon /><h3 className="mt-3 text-sm text-slate-400">{title}</h3><p className="mt-1.5 text-xs text-slate-700">{subtitle}</p></div>;
}

function FileCode2Icon() {
  return <span className="mx-auto grid size-10 place-items-center rounded-xl bg-white/[.03] text-slate-700"><Layers3 className="size-[18px]" /></span>;
}
