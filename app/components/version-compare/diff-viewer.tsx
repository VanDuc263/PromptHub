import { Columns2, Minus, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { versionDiffRows } from "@/data/compare-versions-data";
import { cn } from "@/lib/utils";
import type { DiffLineType, VersionDiffRow } from "@/types";

export function DiffViewer({
  oldVersion,
  newVersion,
  hideUnchanged,
  loading,
}: {
  oldVersion: string;
  newVersion: string;
  hideUnchanged: boolean;
  loading: boolean;
}) {
  const rows = hideUnchanged
    ? versionDiffRows.filter(
        (row) => row.oldType !== "unchanged" || row.newType !== "unchanged",
      )
    : versionDiffRows;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#161b22]"
    >
      <div className="flex items-center gap-2 border-b border-white/[.07] px-4 py-3">
        <Columns2 className="size-4 text-emerald-400" />
        <h2 className="text-xs font-semibold text-slate-200">Side-by-side diff</h2>
        <div className="ml-auto hidden items-center gap-4 text-[9px] text-slate-700 sm:flex">
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-emerald-500/30" /> Added</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-red-500/30" /> Removed</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-500/30" /> Modified</span>
        </div>
      </div>
      {loading ? (
        <DiffSkeleton />
      ) : (
        <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/[.07]">
          <CodePane version={oldVersion} side="old" rows={rows} />
          <CodePane version={newVersion} side="new" rows={rows} />
        </div>
      )}
    </motion.section>
  );
}

export function FullscreenDiff({
  open,
  oldVersion,
  newVersion,
  hideUnchanged,
  onClose,
}: {
  open: boolean;
  oldVersion: string;
  newVersion: string;
  hideUnchanged: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] overflow-auto bg-[#0d1117] p-3 sm:p-5"
        >
          <div className="mb-3 flex items-center">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Compare {oldVersion} → {newVersion}</h2>
              <p className="mt-1 text-[10px] text-slate-600">Fullscreen difference viewer</p>
            </div>
            <Button variant="secondary" className="ml-auto" onClick={onClose}><X className="size-4" /> Close</Button>
          </div>
          <DiffViewer oldVersion={oldVersion} newVersion={newVersion} hideUnchanged={hideUnchanged} loading={false} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CodePane({
  version,
  side,
  rows,
}: {
  version: string;
  side: "old" | "new";
  rows: VersionDiffRow[];
}) {
  return (
    <div className="min-w-0">
      <div className="sticky top-0 z-10 flex h-11 items-center border-b border-white/[.07] bg-[#161b22] px-4">
        <span className={cn("mr-2 size-2 rounded-full", side === "old" ? "bg-red-400" : "bg-emerald-400")} />
        <span className="text-[10px] font-medium uppercase tracking-[.12em] text-slate-500">
          {side === "old" ? "Old version" : "New version"}
        </span>
        <span className="ml-auto rounded-md border border-white/[.07] bg-[#0d1117] px-2 py-1 font-mono text-[10px] text-slate-400">{version}</span>
      </div>
      <div className="h-[520px] overflow-auto bg-[#0d1117]/75 font-mono text-[11px] leading-6">
        <div className="min-w-[620px] py-2">
          {rows.map((row, index) => {
            const line = side === "old" ? row.oldLine : row.newLine;
            const type = side === "old" ? row.oldType : row.newType;
            return (
              <DiffLine
                key={`${side}-${index}-${line}`}
                number={index + 1}
                line={line ?? ""}
                type={type}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DiffLine({
  number,
  line,
  type,
}: {
  number: number;
  line: string;
  type: DiffLineType;
}) {
  return (
    <div
      className={cn(
        "grid h-6 grid-cols-[42px_20px_1fr] [contain-intrinsic-size:24px] [content-visibility:auto]",
        type === "added" && "bg-emerald-500/[.09]",
        type === "removed" && "bg-red-500/[.09]",
        type === "modified" && "bg-amber-500/[.07]",
      )}
    >
      <span className="select-none border-r border-white/[.04] pr-3 text-right text-slate-800">{number}</span>
      <span className={cn("select-none text-center", type === "added" && "text-emerald-400", type === "removed" && "text-red-400", type === "modified" && "text-amber-400")}>
        {type === "added" ? <Plus className="mx-auto mt-1.5 size-3" /> : type === "removed" ? <Minus className="mx-auto mt-1.5 size-3" /> : type === "modified" ? "~" : ""}
      </span>
      <code className="whitespace-pre px-2 text-slate-400">{highlightSyntax(line)}</code>
    </div>
  );
}

function highlightSyntax(line: string) {
  return line.split(/(\{\{[a-zA-Z0-9_]+\}\}|"[^"]*")/g).map((part, index) => {
    if (/^\{\{.+\}\}$/.test(part)) return <span key={index} className="text-violet-300">{part}</span>;
    if (/^".*"$/.test(part)) return <span key={index} className="text-sky-300">{part}</span>;
    return part;
  });
}

function DiffSkeleton() {
  const widths = ["w-[82%]", "w-[55%]", "w-[92%]", "w-[68%]", "w-[76%]", "w-[44%]", "w-[88%]", "w-[62%]"];
  return (
    <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/[.07]">
      {[0, 1].map((pane) => (
        <div key={pane} className="space-y-3 bg-[#0d1117]/70 p-5">
          {widths.map((width, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: index * 0.04 }}
              className={`h-2 rounded bg-white/[.06] ${width}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
