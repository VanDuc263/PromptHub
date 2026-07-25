import { Sparkles } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center rounded-lg bg-violet-500 text-white shadow-[0_0_22px_rgba(139,92,246,.2)]">
        <Sparkles className="size-4" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-slate-50">
          Prompt<span className="text-violet-400">Hub</span>
        </span>
      )}
    </div>
  );
}
