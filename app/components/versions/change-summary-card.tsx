import { ArrowDownRight, ArrowUpRight, GitCompareArrows, Variable } from "lucide-react";
import { motion } from "framer-motion";
import { variableChanges, versionChangeMetrics } from "@/data/create-version-data";
import { cn } from "@/lib/utils";

export function ChangeSummaryCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.06 }}
      className="rounded-2xl border border-white/[.07] bg-[#161b22]"
    >
      <div className="flex items-center gap-3 border-b border-white/[.07] px-5 py-4">
        <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <GitCompareArrows className="size-4" />
        </span>
        <div>
          <h2 className="text-xs font-semibold text-slate-200">Change summary</h2>
          <p className="mt-0.5 text-[9px] text-slate-700">Compared automatically with Version v4</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/[.06] sm:grid-cols-5">
        {versionChangeMetrics.map((metric) => (
          <div key={metric.label} className="bg-[#161b22] p-4 last:col-span-2 sm:last:col-span-1">
            <div className="flex items-center gap-1.5">
              {metric.tone === "positive" && <ArrowUpRight className="size-3.5 text-emerald-400" />}
              {metric.tone === "negative" && <ArrowDownRight className="size-3.5 text-red-400" />}
              {metric.tone === "neutral" && <Variable className="size-3.5 text-violet-400" />}
              <p className={cn("text-sm font-semibold", metric.tone === "positive" ? "text-emerald-400" : metric.tone === "negative" ? "text-red-400" : "text-slate-200")}>
                {metric.value}
              </p>
            </div>
            <p className="mt-1.5 text-[9px] text-slate-700">{metric.label}</p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export function VariableChangesCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.12 }}
      className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-slate-200">Variable changes</h2>
          <p className="mt-1 text-[9px] text-slate-700">Detected from the current draft</p>
        </div>
        <span className="rounded-md bg-violet-500/[.08] px-2 py-1 text-[10px] text-violet-300">{variableChanges.length} updates</span>
      </div>
      <div className="mt-4 divide-y divide-white/[.06]">
        {variableChanges.map((change) => (
          <div key={change.name} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
            <div className="flex min-w-40 items-center gap-2">
              <span className={cn(
                "rounded px-1.5 py-0.5 text-[9px] font-medium",
                change.type === "Added" && "bg-emerald-500/10 text-emerald-400",
                change.type === "Removed" && "bg-red-500/10 text-red-400",
                change.type === "Modified" && "bg-amber-500/10 text-amber-400",
              )}>
                {change.type}
              </span>
              <code className="text-[11px] text-slate-300">{change.name}</code>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 text-[10px]">
              {change.oldValue && <span className="truncate rounded bg-red-500/[.05] px-2 py-1 text-red-300/70">{change.oldValue}</span>}
              {change.oldValue && change.newValue && <span className="text-slate-700">→</span>}
              {change.newValue && <span className="truncate rounded bg-emerald-500/[.05] px-2 py-1 text-emerald-300/70">{change.newValue}</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
