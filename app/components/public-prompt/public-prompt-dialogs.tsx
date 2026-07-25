import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  FileJson,
  FileText,
  GitFork,
  LoaderCircle,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { publicPrompt, publicPromptContent } from "@/data/public-prompt-data";
import { cn } from "@/lib/utils";

export function ForkPromptDialog({
  open,
  onOpenChange,
  onAction,
}: DialogProps) {
  const [workspace, setWorkspace] = useState<"Personal" | "Team">("Personal");
  const [name, setName] = useState(publicPrompt.title);
  const [keepHistory, setKeepHistory] = useState(true);
  const [loading, setLoading] = useState(false);

  const fork = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      onAction(`${name} forked to ${workspace} Workspace`);
    }, 800);
  };

  return (
    <AnimatedDialog open={open} onOpenChange={onOpenChange} title="Fork prompt" description="Create an editable copy in one of your workspaces.">
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "Personal" as const, icon: UserRound, label: "Personal Workspace" },
          { value: "Team" as const, icon: Users, label: "Team Workspace" },
        ].map((option) => {
          const Icon = option.icon;
          return (
            <button type="button" key={option.value} onClick={() => setWorkspace(option.value)} className={cn("rounded-xl border p-3 text-left transition", workspace === option.value ? "border-emerald-500/35 bg-emerald-500/[.06]" : "border-white/[.07] bg-white/[.02]")}>
              <Icon className={cn("size-4", workspace === option.value ? "text-emerald-400" : "text-slate-600")} />
              <span className="mt-3 block text-[10px] font-medium text-slate-300">{option.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-5">
        <label htmlFor="fork-name" className="text-[10px] font-medium text-slate-500">Rename prompt</label>
        <input id="fork-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-10 w-full rounded-lg border border-white/[.08] bg-[#0d1117] px-3 text-xs text-slate-200 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10" />
      </div>
      <button type="button" role="checkbox" aria-checked={keepHistory} onClick={() => setKeepHistory((value) => !value)} className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
        <span className={cn("grid size-4 place-items-center rounded border", keepHistory ? "border-emerald-500 bg-emerald-500 text-[#07120b]" : "border-white/[.12]")}>{keepHistory && <Check className="size-3" />}</span>
        Keep version history
      </button>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
        <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={fork} disabled={loading || !name.trim()}>
          {loading ? <LoaderCircle className="size-4 animate-spin" /> : <GitFork className="size-4" />}
          {loading ? "Forking..." : "Fork prompt"}
        </Button>
      </div>
    </AnimatedDialog>
  );
}

export function CopyPublicPromptDialog({
  open,
  onOpenChange,
  onAction,
}: DialogProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (format: "Prompt" | "Markdown" | "JSON") => {
    const content =
      format === "JSON"
        ? JSON.stringify({ title: publicPrompt.title, prompt: publicPromptContent }, null, 2)
        : format === "Markdown"
          ? `# ${publicPrompt.title}\n\n\`\`\`text\n${publicPromptContent}\n\`\`\``
          : publicPromptContent;
    await navigator.clipboard.writeText(content);
    setCopied(format);
    onAction(`${format} copied`);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const options = [
    { label: "Copy Prompt" as const, description: "Plain prompt template", icon: Copy },
    { label: "Copy Markdown" as const, description: "Title and fenced prompt content", icon: FileText },
    { label: "Copy JSON" as const, description: "Structured title and prompt fields", icon: FileJson },
  ];

  return (
    <AnimatedDialog open={open} onOpenChange={onOpenChange} title="Copy prompt" description="Choose the format that fits your workflow.">
      <div className="space-y-2">
        {options.map((option) => {
          const format = option.label.replace("Copy ", "") as "Prompt" | "Markdown" | "JSON";
          const Icon = option.icon;
          const active = copied === format;
          return (
            <button type="button" key={option.label} onClick={() => copy(format)} className="flex w-full items-center rounded-xl border border-white/[.07] bg-white/[.02] p-3.5 text-left transition hover:border-emerald-500/20">
              <span className={cn("grid size-9 place-items-center rounded-lg", active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[.04] text-slate-500")}>{active ? <Check className="size-4" /> : <Icon className="size-4" />}</span>
              <span className="ml-3"><span className="block text-xs font-medium text-slate-200">{active ? "Copied" : option.label}</span><span className="mt-1 block text-[10px] text-slate-600">{option.description}</span></span>
              <ChevronDown className="-rotate-90 ml-auto size-3.5 text-slate-700" />
            </button>
          );
        })}
      </div>
    </AnimatedDialog>
  );
}

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (label: string) => void;
}

function AnimatedDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const descriptionId = `${title.toLowerCase().replace(/\s+/g, "-")}-description`;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" /></Dialog.Overlay>
            <Dialog.Content asChild aria-describedby={descriptionId}>
              <motion.div initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none">
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400"><Code2 className="size-[18px]" /></span>
                  <Dialog.Close asChild><Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button></Dialog.Close>
                </div>
                <Dialog.Title className="mt-5 text-lg font-semibold text-slate-50">{title}</Dialog.Title>
                <Dialog.Description id={descriptionId} className="mb-5 mt-2 text-xs text-slate-500">{description}</Dialog.Description>
                {children}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
