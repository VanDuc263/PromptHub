import { ArrowRight } from "lucide-react";

export function SectionHeading({
  title,
  eyebrow,
  action,
  onAction,
}: {
  title: string;
  eyebrow?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-600">{eyebrow}</p>}
        <h2 className="text-base font-semibold tracking-[-.015em] text-slate-100">{title}</h2>
      </div>
      {action && (
        <button type="button" onClick={onAction} className="group inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-violet-300">
          {action}<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      )}
    </div>
  );
}
