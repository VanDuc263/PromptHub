import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-violet-500/15 text-[11px] font-semibold text-violet-200",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
