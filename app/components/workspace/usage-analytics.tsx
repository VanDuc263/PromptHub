import { BarChart3, MousePointerClick, Sparkles, Users } from "lucide-react";
import { analyticsSeries } from "@/data/workspace-data";

const chartConfig = [
  { key: "creations", title: "Prompt creations", value: "172", change: "+12.8%", icon: Sparkles },
  { key: "executions", title: "Prompt executions", value: "24.5K", change: "+18.4%", icon: MousePointerClick },
  { key: "members", title: "Member activity", value: "86%", change: "+6.2%", icon: Users },
] as const;

export function UsageAnalytics() {
  return (
    <section aria-labelledby="usage-analytics-heading">
      <div className="mb-3 flex items-center gap-2">
        <BarChart3 className="size-4 text-violet-400" />
        <h2 id="usage-analytics-heading" className="text-sm font-semibold text-slate-100">Usage Analytics</h2>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {chartConfig.map(({ key, title, value, change, icon: Icon }) => {
          const values = analyticsSeries[key];
          return (
            <article key={key} className="rounded-xl border border-white/[.07] bg-[#161b22] p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-300">{title}</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-slate-100">{value}</span>
                    <span className="text-[10px] text-emerald-400/80">{change}</span>
                  </div>
                </div>
                <Icon className="size-4 text-slate-600" />
              </div>
              <div className="mt-5 flex h-24 items-end gap-1.5" aria-label={`${title} chart`}>
                {values.map((height, index) => (
                  <span key={index} className="group relative flex-1">
                    <span
                      className="block min-h-2 rounded-t bg-violet-500/25 transition group-hover:bg-violet-400/50"
                      style={{ height: `${height}%` }}
                    />
                  </span>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[9px] text-slate-700"><span>12 weeks ago</span><span>This week</span></div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
