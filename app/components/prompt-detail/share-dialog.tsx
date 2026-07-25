import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, Globe2, Link2, LockKeyhole, Users, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { promptDetail } from "@/data/prompt-detail-data";
import { cn } from "@/lib/utils";

const visibilityOptions = [
  { value: "Private", description: "Only you can access this prompt", icon: LockKeyhole },
  { value: "Public", description: "Anyone can discover and use it", icon: Globe2 },
  { value: "Unlisted", description: "Anyone with the link can access it", icon: Link2 },
  { value: "Workspace", description: "Visible to workspace members", icon: Users },
];

export function ShareDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (label: string) => void;
}) {
  const [visibility, setVisibility] = useState("Private");
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(promptDetail.shareUrl);
    setCopied(true);
    onAction("Share link copied");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none" aria-describedby="share-description">
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-[-.02em] text-slate-50">Share prompt</Dialog.Title>
              <Dialog.Description id="share-description" className="mt-1.5 text-xs text-slate-500">Choose who can access Java Code Reviewer.</Dialog.Description>
            </div>
            <Dialog.Close asChild><Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button></Dialog.Close>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              const selected = visibility === option.value;
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => {
                    setVisibility(option.value);
                    onAction(`Visibility changed to ${option.value}`);
                  }}
                  className={cn(
                    "rounded-lg border p-3 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500/60",
                    selected ? "border-violet-500/50 bg-violet-500/[.08]" : "border-white/[.07] bg-white/[.02] hover:border-white/[.13]",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={cn("size-4", selected ? "text-violet-300" : "text-slate-600")} />
                    <span className="text-xs font-medium text-slate-200">{option.value}</span>
                    {selected && <Check className="ml-auto size-3.5 text-violet-400" />}
                  </div>
                  <p className="mt-2 text-[10px] leading-4 text-slate-600">{option.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <label className="text-[11px] font-medium text-slate-400">Shareable link</label>
            <div className="mt-2 flex gap-2">
              <div className="flex h-10 min-w-0 flex-1 items-center truncate rounded-lg border border-white/[.08] bg-[#0d1117] px-3 font-mono text-[10px] text-slate-600">{promptDetail.shareUrl}</div>
              <Button variant="secondary" onClick={copyLink}>{copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy link"}</Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
