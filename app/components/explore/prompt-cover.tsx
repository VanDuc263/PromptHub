import { Braces, Circle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExplorePrompt } from "@/types";

export function PromptCover({
  prompt,
  large = false,
}: {
  prompt: ExplorePrompt;
  large?: boolean;
}) {
  const Icon = prompt.icon;
  return (
    <div className={cn("relative overflow-hidden border-b border-white/[.06] bg-[#11161d]", large ? "h-36" : "h-28")}>
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,rgba(148,163,184,.16)_1px,transparent_1px)] [background-size:16px_16px]" />
      <span className={cn("absolute left-[18%] top-[24%] rounded-full border border-white/[.06]", large ? "size-24" : "size-16")} />
      <span className="absolute bottom-[18%] right-[16%] size-8 rounded-lg border border-white/[.06] bg-white/[.02]" />
      <Circle className="absolute right-[28%] top-[18%] size-3 fill-emerald-400/40 text-emerald-400/50" />
      <Braces className="absolute bottom-[20%] left-[12%] size-4 text-slate-700" />
      <Sparkles className="absolute right-[9%] top-[42%] size-3.5 text-slate-700" />
      <span className={cn("absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/[.08] shadow-2xl", prompt.accent, large ? "size-16" : "size-12")}>
        <Icon className={large ? "size-7" : "size-5"} strokeWidth={1.6} />
      </span>
      <div className="absolute inset-x-0 bottom-0 h-px bg-emerald-400/20" />
    </div>
  );
}
