import { ArrowRight, Check, Gauge, Variable } from "lucide-react";
import { motion } from "framer-motion";
import { metricComparisons, variableComparisons } from "@/data/compare-versions-data";
import { cn } from "@/lib/utils";

export function VariableComparisonTable() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24 }}
      className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]"
    >
      <div className="flex items-center gap-2 border-b border-white/[.07] px-5 py-4">
        <Variable className="size-4 text-violet-400" />
        <h2 className="text-xs font-semibold text-slate-200">Variable changes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-left">
          <thead>
            <tr className="border-b border-white/[.06] text-[9px] uppercase tracking-[.12em] text-slate-700">
              <th className="px-5 py-3 font-medium">Variable</th>
              <th className="px-5 py-3 font-medium">Old</th>
              <th className="w-8 py-3" />
              <th className="px-5 py-3 font-medium">New</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[.055]">
            {variableComparisons.map((variable) => {
              const changed = variable.oldValue !== variable.newValue;
              return (
                <tr key={variable.name} className="transition hover:bg-white/[.02]">
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-300">{variable.name}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-md px-2 py-1 text-[11px]", changed ? "bg-red-500/[.07] text-red-300/80" : "text-slate-500")}>{variable.oldValue}</span>
                  </td>
                  <td className="py-3 text-slate-700">{changed ? <ArrowRight className="size-3.5" /> : <Check className="size-3.5 text-emerald-500/50" />}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-md px-2 py-1 text-[11px]", changed ? "bg-emerald-500/[.07] text-emerald-300/80" : "text-slate-500")}>{variable.newValue}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}

export function PromptMetrics() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: 0.05 }}
      className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"
    >
      <div className="flex items-center gap-2">
        <Gauge className="size-4 text-emerald-400" />
        <h2 className="text-xs font-semibold text-slate-200">Prompt metrics</h2>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {metricComparisons.map((metric) => (
          <div key={metric.label} className="rounded-lg border border-white/[.06] bg-[#0d1117]/60 p-3">
            <p className="text-[9px] text-slate-700">{metric.label}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px]">
              <span className="text-slate-600">{metric.oldValue}</span>
              <ArrowRight className="size-3 text-slate-800" />
              <span className="font-medium text-emerald-300">{metric.newValue}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
