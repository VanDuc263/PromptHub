import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastState = { message: string; tone: "success" | "error" | "info" } | null;

export function AuthToast({ toast }: { toast: ToastState }) {
  const Icon = toast?.tone === "success" ? CheckCircle2 : toast?.tone === "error" ? AlertCircle : Info;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-2 rounded-lg border bg-[#1c2128] px-4 py-3 text-xs text-slate-200 shadow-2xl transition duration-200 sm:left-auto sm:right-5 sm:translate-x-0",
        toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
        toast?.tone === "error" ? "border-red-500/25" : "border-white/[.1]",
      )}
    >
      <Icon className={cn("size-4 shrink-0", toast?.tone === "success" ? "text-emerald-400" : toast?.tone === "error" ? "text-red-400" : "text-violet-400")} />
      {toast?.message}
    </div>
  );
}
