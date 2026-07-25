import * as Dialog from "@radix-ui/react-dialog";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Modal({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: React.ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[121] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl outline-none"><Dialog.Title className="text-lg font-semibold text-slate-100">{title}</Dialog.Title><Dialog.Description className="mt-2 text-sm leading-6 text-slate-500">{description}</Dialog.Description><Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-white/[.05] hover:text-slate-200"><X className="size-4" /></Dialog.Close>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function RemoveHistoryDialog({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  return <Modal open={open} onOpenChange={onOpenChange} title="Remove this activity?" description="This removes the activity from your history. The related content will not be affected."><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={onConfirm}>Remove</Button></div></Modal>;
}

export function ClearHistoryDialog({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (mode: "all" | "viewed" | "30d" | "90d") => void }) {
  const [mode, setMode] = useState<"all" | "viewed" | "30d" | "90d">("all");
  const options = [["all", "Clear all history"], ["viewed", "Clear viewed history only"], ["30d", "Clear history older than 30 days"], ["90d", "Clear history older than 90 days"]] as const;
  return <Modal open={open} onOpenChange={onOpenChange} title="Clear activity history?" description="This removes activity records from your account. Your prompts, saved items, collections, and versions will not be deleted."><div className="mt-5 space-y-2">{options.map(([value, label]) => <button type="button" key={value} onClick={() => setMode(value)} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left text-xs transition", mode === value ? "border-rose-500/30 bg-rose-500/[.06] text-slate-200" : "border-white/[.07] text-slate-500 hover:bg-white/[.03]")}><span className={cn("size-3.5 rounded-full border-2", mode === value ? "border-rose-400 bg-rose-400 ring-2 ring-[#161b22] ring-offset-1 ring-offset-rose-400" : "border-slate-700")} />{label}</button>)}</div><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={() => onConfirm(mode)}><Trash2 className="size-4" /> Clear History</Button></div></Modal>;
}
