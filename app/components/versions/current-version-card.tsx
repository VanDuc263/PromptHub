import { Clock3, GitCommitHorizontal, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { currentVersionInfo } from "@/data/create-version-data";

export function CurrentVersionCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">Current version</p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-[-.03em] text-slate-100">{currentVersionInfo.version}</p>
        </div>
        <Badge className="border-emerald-500/20 bg-emerald-500/[.08] text-emerald-400">Current</Badge>
      </div>
      <div className="mt-5 grid gap-4 border-t border-white/[.06] pt-4 sm:grid-cols-3">
        <Meta icon={Clock3} label="Created" value={currentVersionInfo.createdAt} />
        <Meta icon={UserRound} label="Author" value={currentVersionInfo.author} />
        <Meta icon={GitCommitHorizontal} label="Commit message" value={currentVersionInfo.commitMessage} />
      </div>
    </motion.section>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-slate-700" />
      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[.1em] text-slate-700">{label}</p>
        <p className="mt-1 truncate text-[11px] font-medium text-slate-300">{value}</p>
      </div>
    </div>
  );
}
