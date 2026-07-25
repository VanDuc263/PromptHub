import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/[.07] bg-white/[.035] px-2 py-1 text-[11px] font-medium text-slate-400",
        className,
      )}
      {...props}
    />
  );
}
