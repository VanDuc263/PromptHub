import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, Expand, FileCode2, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { promptTemplate } from "@/data/prompt-detail-data";

export function TemplateCard() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const words = promptTemplate.trim().split(/\s+/).length;

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(promptTemplate);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22]">
        <div className="flex min-h-14 items-center gap-3 border-b border-white/[.07] px-4 sm:px-5">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-300">
            <FileCode2 className="size-4" />
          </span>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Prompt template</h2>
            <p className="mt-0.5 text-[9px] text-slate-700">Original content · Variables highlighted</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={copyTemplate}>
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy template"}</span>
            </Button>
            <Button variant="icon" size="icon" className="size-8" onClick={() => setExpanded(true)} aria-label="Expand template">
              <Expand className="size-3.5" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto bg-[#0d1117]/60 p-5 sm:p-6">
          <HighlightedTemplate />
        </div>
        <div className="flex h-9 items-center gap-4 border-t border-white/[.06] px-5 font-mono text-[9px] text-slate-700">
          <span>{promptTemplate.length} characters</span>
          <span>{words} words</span>
          <span className="ml-auto">4 variables</span>
        </div>
      </section>

      <Dialog.Root open={expanded} onOpenChange={setExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-4 z-[80] flex flex-col overflow-hidden rounded-xl border border-white/[.1] bg-[#161b22] shadow-2xl outline-none sm:inset-10" aria-describedby={undefined}>
            <div className="flex h-14 shrink-0 items-center border-b border-white/[.07] px-4">
              <Dialog.Title className="text-sm font-semibold text-slate-100">Java Code Reviewer · Template</Dialog.Title>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={copyTemplate}><Copy className="size-3.5" /> Copy</Button>
              <Dialog.Close asChild><Button variant="icon" size="icon" className="ml-1 size-8"><X className="size-4" /></Button></Dialog.Close>
            </div>
            <div className="flex-1 overflow-auto bg-[#0d1117]/60 p-6 sm:p-10">
              <HighlightedTemplate className="text-sm leading-7" />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function HighlightedTemplate({ className = "" }: { className?: string }) {
  const segments = promptTemplate.split(/(\{\{[a-zA-Z0-9_]+\}\})/g);
  return (
    <pre className={`whitespace-pre-wrap font-mono text-xs leading-6 text-slate-400 ${className}`}>
      {segments.map((segment, index): ReactNode =>
        /^\{\{.+\}\}$/.test(segment) ? (
          <mark key={`${segment}-${index}`} className="rounded bg-violet-500/10 px-1 py-0.5 text-violet-300">
            {segment}
          </mark>
        ) : (
          segment
        ),
      )}
    </pre>
  );
}
