import { ArrowUpRight } from "lucide-react";
import type { QuickAction } from "@/types";

export function QuickActionCard({
  action,
  onClick,
}: {
  action: QuickAction;
  onClick: () => void;
}) {
  const Icon = action.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className="card-hover group flex min-h-40 flex-col rounded-xl border border-white/[.07] bg-[#161b22] p-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60"
    >
      <span className="grid size-9 place-items-center rounded-lg border border-violet-400/15 bg-violet-500/10 text-violet-300">
        <Icon className="size-[17px]" strokeWidth={1.8} />
      </span>
      <div className="mt-5 flex items-start gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">{action.title}</h3>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">{action.description}</p>
        </div>
        <ArrowUpRight className="ml-auto size-4 shrink-0 text-slate-700 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-400" />
      </div>
    </button>
  );
}
