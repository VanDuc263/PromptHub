import {
  ArrowRight,
  CircleUserRound,
  Crown,
  Gauge,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  endorsedSkills,
  suggestedCreators,
} from "@/data/profile-data";
import { cn, formatCompact } from "@/lib/utils";

export function ProfileSidebar({
  isOwner,
  onEdit,
  onAction,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onAction: (label: string) => void;
}) {
  return (
    <aside className="space-y-4 xl:sticky xl:top-[132px] xl:self-start">
      {isOwner && <ProfileCompletion onEdit={onEdit} />}
      <SidebarPanel icon={Crown} title="Creator rank">
        <div className="rounded-xl border border-violet-500/15 bg-violet-500/[.045] p-4 text-center">
          <p className="text-lg font-semibold text-violet-200">Top 5% Creator</p>
          <p className="mt-1 text-[9px] text-slate-600">#12 in Programming</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <MiniMetric value="4,280" label="Monthly copies" positive />
          <MiniMetric value="+186" label="Monthly followers" positive />
        </div>
      </SidebarPanel>
      <SidebarPanel icon={Sparkles} title="Top skills">
        <div className="space-y-2">
          {endorsedSkills.map(([skill, count]) => (
            <div key={skill} className="flex items-center text-[10px]">
              <span className="text-slate-500">{skill}</span>
              <div className="mx-2 h-1 flex-1 overflow-hidden rounded bg-white/[.04]"><div className={cn("h-full rounded bg-violet-400/50", skillWidth(count))} /></div>
              <span className="w-6 text-right font-mono text-[8px] text-slate-700">{count}</span>
            </div>
          ))}
        </div>
      </SidebarPanel>
      <FollowingSuggestions onAction={onAction} />
    </aside>
  );
}

function ProfileCompletion({ onEdit }: { onEdit: () => void }) {
  return (
    <SidebarPanel icon={Gauge} title="Profile completion">
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-slate-100">85%</span>
        <span className="text-[9px] text-emerald-400">Almost there</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded bg-white/[.05]"><div className="h-full w-[85%] rounded bg-emerald-400" /></div>
      <div className="mt-4 space-y-2 text-[9px] text-slate-600">
        {["Add website", "Add profile banner", "Verify GitHub account"].map((item) => <p key={item} className="flex items-center gap-2"><span className="size-1 rounded-full bg-amber-400" />{item}</p>)}
      </div>
      <Button variant="secondary" size="sm" className="mt-4 w-full" onClick={onEdit}>Complete profile <ArrowRight className="size-3.5" /></Button>
    </SidebarPanel>
  );
}


function FollowingSuggestions({ onAction }: { onAction: (label: string) => void }) {
  const [followed, setFollowed] = useState<string[]>([]);
  return (
    <SidebarPanel icon={UserPlus} title="Creators to follow">
      <div className="space-y-3">
        {suggestedCreators.map((creator) => {
          const isFollowed = followed.includes(creator.name);
          return (
            <div key={creator.name} className="flex items-center">
              <Avatar initials={creator.initials} className={cn("size-7 text-[8px]", creator.tone)} />
              <div className="ml-2 min-w-0 flex-1">
                <p className="truncate text-[10px] font-medium text-slate-300">{creator.name}</p>
                <p className="mt-0.5 truncate text-[8px] text-slate-700">{creator.expertise} · {formatCompact(creator.followers)}</p>
              </div>
              <button type="button" onClick={() => { setFollowed((current) => isFollowed ? current.filter((name) => name !== creator.name) : [...current, creator.name]); onAction(isFollowed ? `Unfollowed ${creator.name}` : `Following ${creator.name}`); }} className={cn("rounded-md border px-2 py-1 text-[8px] transition", isFollowed ? "border-emerald-500/20 bg-emerald-500/[.06] text-emerald-400" : "border-white/[.07] text-slate-600 hover:text-violet-300")}>
                {isFollowed ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </SidebarPanel>
  );
}

function SidebarPanel({ icon: Icon, title, children }: { icon: typeof CircleUserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4">
      <div className="mb-4 flex items-center gap-2"><Icon className="size-3.5 text-violet-400" /><h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-600">{title}</h2></div>
      {children}
    </section>
  );
}

function MiniMetric({ value, label, positive }: { value: string; label: string; positive?: boolean }) {
  return <div className="rounded-lg bg-white/[.025] p-3"><p className={cn("text-sm font-semibold", positive ? "text-emerald-400" : "text-slate-200")}>{value}</p><p className="mt-1 text-[8px] text-slate-700">{label}</p></div>;
}

function skillWidth(value: number) {
  if (value >= 120) return "w-full";
  if (value >= 100) return "w-5/6";
  if (value >= 90) return "w-3/4";
  if (value >= 80) return "w-2/3";
  return "w-1/2";
}


