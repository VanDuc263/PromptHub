import {
  GitFork,
  History,
  MessageCircle,
  MoreHorizontal,
  PackageCheck,
  RotateCcw,
  Settings,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ActivityKind, WorkspaceActivity } from "@/data/workspace-data";

const activityIcons: Record<ActivityKind, LucideIcon> = {
  prompt: Sparkles,
  member: UserPlus,
  fork: GitFork,
  version: PackageCheck,
  collection: History,
  workspace: Settings,
  comment: MessageCircle,
  restore: RotateCcw,
};

export function ActivityTimeline({
  activities,
  compact = false,
}: {
  activities: WorkspaceActivity[];
  compact?: boolean;
}) {
  if (!activities.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/[.08] px-6 py-16 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-500/[.06]">
          <History className="size-6 text-violet-400/60" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-300">No recent activity.</h3>
        <p className="mt-1 text-xs text-slate-600">Workspace changes and collaboration will appear here.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <span className="absolute bottom-5 left-[18px] top-5 w-px bg-white/[.07]" aria-hidden />
      <div className={cn("space-y-1", !compact && "rounded-xl border border-white/[.07] bg-[#161b22] p-2")}>
        {activities.map((activity) => {
          const Icon = activityIcons[activity.kind];
          return (
            <article key={activity.id} className="group relative flex gap-3 rounded-lg p-2.5 transition hover:bg-white/[.025]">
              <div className="relative z-10">
                <Avatar initials={activity.initials} className="size-9 bg-[#1c2128] text-[10px]" />
                <span className="absolute -bottom-1 -right-1 grid size-4 place-items-center rounded-full border border-[#161b22] bg-[#252b35]">
                  <Icon className="size-2.5 text-violet-400" />
                </span>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-xs leading-5 text-slate-400">
                  <strong className="font-medium text-slate-200">{activity.actor}</strong>{" "}
                  {activity.action}{" "}
                  <span className="font-medium text-slate-300">{activity.target}</span>
                </p>
                <p className="mt-0.5 text-[10px] text-slate-600">{activity.time}</p>
              </div>
              <button type="button" aria-label="Activity actions" className="self-start rounded-md p-1.5 text-slate-700 opacity-0 outline-none transition hover:bg-white/[.05] hover:text-slate-400 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-violet-500/70 group-hover:opacity-100">
                <MoreHorizontal className="size-3.5" />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
