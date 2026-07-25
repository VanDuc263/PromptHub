import * as Dialog from "@radix-ui/react-dialog";
import {
  BookOpenText,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Copy,
  Expand,
  FileCode2,
  ListTree,
  Variable,
  WrapText,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  publicExamples,
  publicPromptContent,
  publicVariables,
  publicVersions,
} from "@/data/public-prompt-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "prompt", label: "Prompt", icon: FileCode2 },
  { id: "variables", label: "Variables", icon: Variable },
  { id: "examples", label: "Examples", icon: Code2 },
  { id: "documentation", label: "Documentation", icon: BookOpenText },
  { id: "versions", label: "Versions", icon: Clock3 },
] as const;

type PublicTab = (typeof tabs)[number]["id"];

export function PublicPromptTabs({
  onAction,
}: {
  onAction: (label: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<PublicTab>("prompt");

  return (
    <section className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]">
      <div className="overflow-x-auto border-b border-white/[.07] px-2">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative inline-flex h-12 items-center gap-2 px-3 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-500/50",
                  activeTab === tab.id ? "text-emerald-300" : "text-slate-600 hover:text-slate-300",
                )}
              >
                <Icon className="size-3.5" /> {tab.label}
                {activeTab === tab.id && <motion.span layoutId="public-tab" className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
        >
          {activeTab === "prompt" && <ReadOnlyPromptEditor />}
          {activeTab === "variables" && <VariablesTab />}
          {activeTab === "examples" && <ExamplesTab />}
          {activeTab === "documentation" && <DocumentationTab />}
          {activeTab === "versions" && <VersionsTab onAction={onAction} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function ReadOnlyPromptEditor() {
  const [wrap, setWrap] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const words = publicPromptContent.trim().split(/\s+/).length;
  const tokens = Math.ceil(publicPromptContent.length / 4);

  const copy = async () => {
    await navigator.clipboard.writeText(publicPromptContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const editor = <CodeEditor wrap={wrap} />;

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-white/[.06] px-3 py-2">
        <span className="px-2 text-[9px] font-semibold uppercase tracking-[.12em] text-slate-700">Read only</span>
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => setWrap((value) => !value)}><WrapText className="size-3.5" /> <span className="hidden sm:inline">Word wrap {wrap ? "on" : "off"}</span></Button>
          <Button variant="ghost" size="sm" onClick={copy}>{copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />} <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span></Button>
          <Button variant="icon" size="icon" className="size-8" onClick={() => setExpanded(true)} aria-label="Expand prompt"><Expand className="size-3.5" /></Button>
        </div>
      </div>
      {editor}
      <div className="flex h-9 items-center gap-4 border-t border-white/[.06] px-4 font-mono text-[9px] text-slate-700">
        <span>{words} words</span><span>~{tokens} tokens</span><span>{publicPromptContent.length} characters</span>
      </div>

      <Dialog.Root open={expanded} onOpenChange={setExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-4 z-[90] flex flex-col overflow-hidden rounded-2xl border border-white/[.1] bg-[#161b22] shadow-2xl outline-none sm:inset-8" aria-describedby={undefined}>
            <div className="flex h-14 shrink-0 items-center border-b border-white/[.07] px-4">
              <Dialog.Title className="text-sm font-semibold text-slate-100">Spring Boot API Generator</Dialog.Title>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setWrap((value) => !value)}><WrapText className="size-3.5" /> Wrap</Button>
              <Button variant="ghost" size="sm" onClick={copy}><Copy className="size-3.5" /> Copy</Button>
              <Dialog.Close asChild><Button variant="icon" size="icon" className="size-8"><X className="size-4" /></Button></Dialog.Close>
            </div>
            <div className="flex-1 overflow-auto"><CodeEditor wrap={wrap} expanded /></div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function CodeEditor({ wrap, expanded }: { wrap: boolean; expanded?: boolean }) {
  return (
    <div className={cn("overflow-auto bg-[#0d1117]/75 font-mono text-[11px] leading-6", expanded ? "min-h-full p-5 sm:p-8" : "max-h-[620px] p-4 sm:p-5")}>
      <div className={wrap ? "min-w-0" : "min-w-[760px]"}>
        {publicPromptContent.split("\n").map((line, index) => (
          <div key={index} className="grid grid-cols-[36px_1fr]">
            <span className="select-none pr-3 text-right text-slate-800">{index + 1}</span>
            <code className={cn("px-2 text-slate-400", wrap ? "whitespace-pre-wrap" : "whitespace-pre")}>{highlightPrompt(line)}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

function highlightPrompt(line: string) {
  return line.split(/(\{\{[a-zA-Z0-9_]+\}\}|`[^`]+`|\b(?:Java|Spring Boot|PostgreSQL|OpenAPI)\b)/g).map((part, index) => {
    if (/^\{\{.+\}\}$/.test(part)) return <span key={index} className="text-violet-300">{part}</span>;
    if (/^`.+`$/.test(part)) return <span key={index} className="text-sky-300">{part}</span>;
    if (/^(Java|Spring Boot|PostgreSQL|OpenAPI)$/.test(part)) return <span key={index} className="text-emerald-300">{part}</span>;
    return part;
  });
}

function VariablesTab() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-white/[.06] text-[9px] uppercase tracking-[.12em] text-slate-700">
            <th className="px-5 py-3 font-medium">Variable</th>
            <th className="px-5 py-3 font-medium">Description</th>
            <th className="px-5 py-3 font-medium">Default value</th>
            <th className="px-5 py-3 font-medium">Required</th>
            <th className="px-5 py-3 font-medium">Example</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[.055]">
          {publicVariables.map((variable) => (
            <tr key={variable.name} className="transition hover:bg-white/[.02]">
              <td className="px-5 py-4"><code className="rounded bg-violet-500/[.07] px-2 py-1 text-[10px] text-violet-300">{`{{${variable.name}}}`}</code></td>
              <td className="px-5 py-4 text-[11px] text-slate-500">{variable.description}</td>
              <td className="px-5 py-4 text-[11px] text-slate-300">{variable.defaultValue}</td>
              <td className="px-5 py-4"><Badge className={variable.required ? "border-emerald-500/15 bg-emerald-500/[.05] text-emerald-300" : ""}>{variable.required ? "Required" : "Optional"}</Badge></td>
              <td className="px-5 py-4 text-[11px] text-slate-500">{variable.example}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExamplesTab() {
  if (!publicExamples.length) return <TabEmpty icon={Code2} title="No examples yet" subtitle="The creator has not added usage examples." />;
  return (
    <div className="space-y-3 p-4 sm:p-5">
      {publicExamples.map((example, index) => (
        <article key={example.id} className="overflow-hidden rounded-xl border border-white/[.07] bg-[#0d1117]/45">
          <div className="flex items-center border-b border-white/[.06] px-4 py-3">
            <span className="grid size-6 place-items-center rounded-md bg-emerald-500/[.08] font-mono text-[9px] text-emerald-400">{index + 1}</span>
            <h3 className="ml-2 text-xs font-medium text-slate-300">{example.title}</h3>
          </div>
          <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/[.06]">
            <div className="p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-700">Input</p>
              <p className="mt-2 text-xs leading-5 text-slate-400">{example.input}</p>
            </div>
            <div className="p-4">
              <p className="text-[9px] font-semibold uppercase tracking-[.12em] text-slate-700">Output preview</p>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-[10px] leading-5 text-slate-500">{example.output}</pre>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function DocumentationTab() {
  const sections = [
    ["Purpose", "Generate a production-ready Spring Boot API foundation from a clear domain description while preserving architectural consistency."],
    ["How to use", "Provide the business domain, API type, target database, and preferred output language. Review generated security and persistence decisions before production use."],
    ["Supported models", "Optimized for GPT-5, Claude, Gemini, and DeepSeek models with strong code-generation capabilities."],
    ["Limitations", "Generated code does not replace architecture review, threat modeling, load testing, or organization-specific compliance checks."],
    ["Best practices", "Include concrete domain rules, required endpoints, authorization boundaries, and existing project conventions for the best result."],
    ["Expected outputs", "Domain model, migration, layered implementation, DTOs, controller, exception handling, test suite, and OpenAPI examples."],
  ];
  return (
    <article className="prose-invert p-5 sm:p-7">
      <div className="max-w-3xl space-y-6">
        {sections.map(([title, content]) => (
          <section key={title}>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200"><ChevronRight className="size-3.5 text-emerald-400" /> {title}</h3>
            <p className="mt-2 text-xs leading-6 text-slate-500">{content}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

function VersionsTab({ onAction }: { onAction: (label: string) => void }) {
  return (
    <div className="p-5">
      {publicVersions.map((version, index) => (
        <div key={version.version} className="relative flex gap-4 pb-6 last:pb-0">
          {index < publicVersions.length - 1 && <span className="absolute bottom-0 left-[15px] top-8 w-px bg-white/[.07]" />}
          <span className={cn("relative grid size-8 shrink-0 place-items-center rounded-full border font-mono text-[9px]", version.current ? "border-emerald-500/30 bg-emerald-500/[.08] text-emerald-300" : "border-white/[.08] bg-[#0d1117] text-slate-600")}>{version.version}</span>
          <div className="min-w-0 flex-1 sm:flex sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-slate-300">{version.note}</p>
                {version.current && <Badge className="border-emerald-500/15 bg-emerald-500/[.05] py-0.5 text-emerald-300">Current version</Badge>}
              </div>
              <p className="mt-1 text-[9px] text-slate-700">{version.date}</p>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 sm:ml-auto sm:mt-0" onClick={() => onAction(`Viewing changes for ${version.version}`)}>View changes</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabEmpty({ icon: Icon, title, subtitle }: { icon: typeof ListTree; title: string; subtitle: string }) {
  return (
    <div className="py-16 text-center">
      <Icon className="mx-auto size-6 text-slate-700" />
      <h3 className="mt-4 text-sm font-medium text-slate-400">{title}</h3>
      <p className="mt-1.5 text-xs text-slate-700">{subtitle}</p>
    </div>
  );
}
