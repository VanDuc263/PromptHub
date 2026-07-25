import { ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection({ onAction }: { onAction: (label: string) => void }) {
  const chartBars = [
    "h-[38%]",
    "h-[58%]",
    "h-[46%]",
    "h-[76%]",
    "h-[66%]",
    "h-[88%]",
    "h-[58%]",
    "h-[96%]",
    "h-[72%]",
    "h-[82%]",
    "h-[54%]",
    "h-[68%]",
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22] px-6 py-8 sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-violet-500/[.055] blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[.14em] text-violet-400">
          Your prompt workspace
        </p>
        <h1 className="text-3xl font-bold tracking-[-.035em] text-slate-50 sm:text-[40px] sm:leading-[1.08]">
          Good afternoon <span aria-hidden="true">👋</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
          Build, organize and share your AI prompts effortlessly.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => onAction("New prompt created")}>
            <Plus className="size-4" /> New prompt
          </Button>
          <Button variant="secondary" onClick={() => onAction("Community opened")}>
            Explore community <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 right-8 hidden h-24 w-48 items-end gap-1.5 opacity-40 lg:flex">
        {chartBars.map((height, index) => (
          <span
            key={index}
            className={`w-2 rounded-t-sm bg-violet-400/20 ${height}`}
          />
        ))}
      </div>
    </section>
  );
}
