import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Statistic } from "@/types";

export function StatisticCard({ statistic }: { statistic: Statistic }) {
  const Icon = statistic.icon;
  const TrendIcon = statistic.positive ? ArrowUpRight : ArrowDownRight;
  return (
    <article className="rounded-xl border border-white/[.07] bg-[#161b22] p-5 transition-colors hover:border-white/[.12]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{statistic.title}</p>
        <Icon className="size-4 text-slate-600" strokeWidth={1.7} />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-[-.035em] text-slate-50">{statistic.value}</p>
      <div className="mt-2 flex items-center gap-1.5 text-[11px]">
        <TrendIcon className={statistic.positive ? "size-3.5 text-emerald-400" : "size-3.5 text-red-400"} />
        <span className={statistic.positive ? "text-emerald-400" : "text-red-400"}>{statistic.change}</span>
      </div>
    </article>
  );
}
