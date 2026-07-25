import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, Expand, FileCode2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { versionDraftContent } from "@/data/create-version-data";

export function VersionPreview({ loading }: { loading: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(versionDraftContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const editor = loading ? <EditorSkeleton /> : <LineNumberEditor />;

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.09 }}
        className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]"
      >
        <div className="flex items-center gap-3 border-b border-white/[.07] px-5 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><FileCode2 className="size-4" /></span>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Prompt preview</h2>
            <p className="mt-0.5 text-[9px] text-slate-700">Read-only snapshot for the new version</p>
          </div>
          <div className="ml-auto flex gap-1">
            <Button variant="ghost" size="sm" onClick={copy} disabled={loading}>
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
            </Button>
            <Button variant="icon" size="icon" className="size-8" onClick={() => setExpanded(true)} disabled={loading} aria-label="Expand prompt preview"><Expand className="size-3.5" /></Button>
          </div>
        </div>
        {editor}
      </motion.section>

      <Dialog.Root open={expanded} onOpenChange={setExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-4 z-[80] flex flex-col overflow-hidden rounded-xl border border-white/[.1] bg-[#161b22] shadow-2xl outline-none sm:inset-8" aria-describedby={undefined}>
            <div className="flex h-14 shrink-0 items-center border-b border-white/[.07] px-4">
              <Dialog.Title className="text-sm font-semibold text-slate-100">Version v5 · Prompt preview</Dialog.Title>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={copy}><Copy className="size-3.5" /> Copy</Button>
              <Dialog.Close asChild><Button variant="icon" size="icon" className="ml-1 size-8"><X className="size-4" /></Button></Dialog.Close>
            </div>
            <div className="flex-1 overflow-auto"><LineNumberEditor expanded /></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function LineNumberEditor({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={`overflow-auto bg-[#0d1117]/70 ${expanded ? "min-h-full p-6 sm:p-8" : "max-h-[520px] p-4 sm:p-5"}`}>
      <div className="min-w-[560px] font-mono text-[11px] leading-6">
        {versionDraftContent.split("\n").map((line, index) => (
          <div key={index} className="grid grid-cols-[32px_1fr]">
            <span className="select-none pr-3 text-right text-slate-800">{index + 1}</span>
            <code className="whitespace-pre-wrap text-slate-400">
              {highlightLine(line)}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}

function highlightLine(line: string) {
  const parts = line.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
  return parts.map((part, index) =>
    /^\{\{.+\}\}$/.test(part) ? <span key={index} className="text-violet-300">{part}</span> : part,
  );
}

function EditorSkeleton() {
  const widths = [
    "w-[72%]",
    "w-[54%]",
    "w-[88%]",
    "w-[42%]",
    "w-[78%]",
    "w-[64%]",
    "w-[92%]",
    "w-[58%]",
    "w-[74%]",
  ];

  return (
    <div className="space-y-3 bg-[#0d1117]/70 p-5">
      {widths.map((width, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.25 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: index * 0.04 }}
          className={`h-2 rounded bg-white/[.06] ${width}`}
        />
      ))}
    </div>
  );
}
