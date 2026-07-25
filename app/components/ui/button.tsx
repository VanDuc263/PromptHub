import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium outline-none transition duration-200 focus-visible:ring-2 focus-visible:ring-violet-500/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-violet-500 text-white shadow-[0_8px_24px_rgba(139,92,246,.22)] hover:scale-[1.02] hover:bg-violet-600",
        secondary: "border border-white/10 bg-white/[.04] text-slate-200 hover:border-white/20 hover:bg-white/[.07]",
        ghost: "text-slate-400 hover:bg-white/[.06] hover:text-slate-100",
        icon: "text-slate-400 hover:bg-white/[.06] hover:text-slate-100",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
