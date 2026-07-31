import { Check, Folder, MessageSquareText, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkspaceSummary } from "@/data/workspace-data";

const tones = {
  violet: "border-violet-400/20 bg-violet-500/10 text-violet-300",
  sky: "border-sky-400/20 bg-sky-500/10 text-sky-300",
  emerald: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
  slate: "border-slate-400/20 bg-slate-500/10 text-slate-300",
};

export function WorkspaceCard({
  workspace,
  current,
  onSelect,
}: {
  workspace: WorkspaceSummary;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      layout
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      onClick={onSelect}
      className={cn(
        "group relative min-h-44 rounded-xl border p-4 text-left outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-violet-500/70",
        current
          ? "border-violet-400/45 bg-violet-500/[.075] shadow-[0_16px_46px_rgba(76,29,149,.15),inset_0_0_30px_rgba(139,92,246,.035)]"
          : "border-white/[.07] bg-[#161b22] hover:border-white/[.13] hover:bg-[#181e26]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid size-10 place-items-center rounded-xl border text-xs font-semibold", tones[workspace.tone])}>
          {workspace.initials}
        </span>
        {current ? (
          <Badge className="border-violet-400/25 bg-violet-500/10 text-[9px] uppercase tracking-wider text-violet-300">
            <Check className="mr-1 size-3" /> Current Workspace
          </Badge>
        ) : (
          <Badge>{workspace.role}</Badge>
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-100">{workspace.name}</h3>
          {current && <span className="text-[10px] text-violet-400">{workspace.role}</span>}
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-600">{workspace.description}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1.5"><MessageSquareText className="size-3.5" /> {workspace.prompts} prompts</span>
        {workspace.members ? (
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" /> {workspace.members} members</span>
        ) : (
          <span className="inline-flex items-center gap-1.5"><Folder className="size-3.5" /> {workspace.collections} collections</span>
        )}
      </div>
    </motion.button>
  );
}
