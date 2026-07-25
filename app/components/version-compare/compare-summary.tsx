import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  ListTree,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { changeHighlights } from "@/data/compare-versions-data";

const cards = [
  { label: "Added lines", value: "+18", icon: ArrowUpRight, tone: "text-emerald-400 bg-emerald-500/[.07]" },
  { label: "Removed lines", value: "-6", icon: ArrowDownRight, tone: "text-red-400 bg-red-500/[.07]" },
  { label: "Modified sections", value: "4", icon: ListTree, tone: "text-amber-400 bg-amber-500/[.07]" },
  { label: "Estimated tokens", value: "1,260 → 1,428", icon: Braces, tone: "text-violet-300 bg-violet-500/[.07]" },
];

export function CompareSummary() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.article
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.22 }}
              className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4 transition hover:-translate-y-0.5 hover:border-white/[.12]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-600">{card.label}</p>
                <span className={`grid size-7 place-items-center rounded-lg ${card.tone}`}><Icon className="size-3.5" /></span>
              </div>
              <p className="mt-3 text-lg font-semibold tracking-[-.025em] text-slate-100 sm:text-xl">{card.value}</p>
            </motion.article>
          );
        })}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.24 }}
        className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[.035] p-5"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-emerald-400" />
          <h2 className="text-xs font-semibold text-slate-200">AI change highlights</h2>
          <span className="ml-auto rounded-md bg-emerald-500/[.08] px-2 py-1 text-[9px] text-emerald-400">Generated</span>
        </div>
        <ul className="mt-4 grid gap-x-8 gap-y-2 md:grid-cols-2">
          {changeHighlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-2 text-[11px] leading-5 text-slate-400">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-emerald-400" />
              {highlight}
            </li>
          ))}
        </ul>
      </motion.section>
    </>
  );
}
