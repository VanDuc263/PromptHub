import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Activity } from "@/types";

export function ActivityItem({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  return (
    <div className="relative flex gap-3.5">
      {!isLast && <span className="absolute bottom-[-20px] left-[15px] top-8 w-px bg-white/[.07]" />}
      <Avatar initials={activity.initials} className={cn("size-8 text-[9px]", activity.tone)} />
      <div className="min-w-0 pb-5">
        <p className="text-xs leading-5 text-slate-400">
          <strong className="font-medium text-slate-200">{activity.actor}</strong>{" "}
          {activity.action}{" "}
          <strong className="font-medium text-slate-300">{activity.target}</strong>.
        </p>
        <p className="mt-1 text-[11px] text-slate-600">{activity.time}</p>
      </div>
    </div>
  );
}
