import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowUpRight,
  Check,
  Copy,
  CopyPlus,
  FolderDown,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExplorePrompt } from "@/types";

export function CopyPromptDialog({
  prompt,
  open,
  onOpenChange,
  onOpenPrompt,
  onAction,
}: {
  prompt: ExplorePrompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenPrompt: () => void;
  onAction: (label: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  if (!prompt) return null;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.snippet);
    setCopied(true);
    onAction(`${prompt.title} copied`);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-describedby="copy-prompt-description">
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400"><Copy className="size-[18px]" /></span>
                  <Dialog.Close asChild><Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button></Dialog.Close>
                </div>
                <Dialog.Title className="mt-5 text-lg font-semibold tracking-[-.02em] text-slate-50">Use {prompt.title}</Dialog.Title>
                <Dialog.Description id="copy-prompt-description" className="mt-2 text-xs leading-5 text-slate-500">
                  Copy a preview, add this prompt to your library, or open its full workspace.
                </Dialog.Description>
                <div className="mt-5 space-y-2">
                  <ModalAction
                    icon={copied ? Check : Copy}
                    title={copied ? "Prompt copied" : "Copy prompt"}
                    description="Copy the reusable prompt snippet"
                    onClick={copyPrompt}
                    active={copied}
                  />
                  <ModalAction
                    icon={FolderDown}
                    title="Duplicate to My Library"
                    description="Create an editable private copy"
                    onClick={() => {
                      onAction(`${prompt.title} duplicated to My Library`);
                      onOpenChange(false);
                    }}
                  />
                  <ModalAction
                    icon={ArrowUpRight}
                    title="Open prompt"
                    description="View variables, versions, and usage"
                    onClick={() => {
                      onOpenChange(false);
                      onOpenPrompt();
                    }}
                  />
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function ModalAction({
  icon: Icon,
  title,
  description,
  onClick,
  active,
}: {
  icon: typeof CopyPlus;
  title: string;
  description: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center rounded-xl border border-white/[.07] bg-white/[.02] p-3.5 text-left outline-none transition hover:border-emerald-500/20 hover:bg-emerald-500/[.03] focus-visible:ring-2 focus-visible:ring-emerald-500/50">
      <span className={`grid size-9 place-items-center rounded-lg ${active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[.04] text-slate-500"}`}><Icon className="size-4" /></span>
      <span className="ml-3">
        <span className="block text-xs font-medium text-slate-200">{title}</span>
        <span className="mt-1 block text-[10px] text-slate-600">{description}</span>
      </span>
      <ArrowUpRight className="ml-auto size-3.5 text-slate-700" />
    </button>
  );
}
