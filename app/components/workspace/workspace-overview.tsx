import { Activity, Folder, MessageSquareText, Users } from "lucide-react";
import { motion } from "framer-motion";
import { overviewMetrics } from "@/data/workspace-data";

const metricIcons = {
  members: Users,
  prompts: MessageSquareText,
  collections: Folder,
  usage: Activity,
};

export function WorkspaceOverview() {
  return (
    <section aria-labelledby="workspace-overview-heading">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 id="workspace-overview-heading" className="text-sm font-semibold text-slate-100">Workspace Overview</h2>
          <p className="mt-1 text-xs text-slate-600">A snapshot of workspace growth and usage.</p>
        </div>
        <span className="text-[10px] text-slate-600">Updated just now</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric, index) => {
          const Icon = metricIcons[metric.icon];
          return (
            <motion.article
              key={metric.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-xl border border-white/[.07] bg-[#161b22] p-4 transition-colors hover:border-violet-400/20 hover:bg-[#181e26]"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-lg border border-violet-400/15 bg-violet-500/[.07]">
                  <Icon className="size-4 text-violet-400" />
                </span>
                <span className="text-[10px] font-medium text-emerald-400/80">{metric.trend}</span>
              </div>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-100">{metric.value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{metric.label}</p>
              <p className="mt-1 text-[10px] text-slate-600">{metric.description}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
