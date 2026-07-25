import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Clipboard,
  Copy,
  Expand,
  Redo2,
  Sparkles,
  Undo2,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PromptVariable } from "@/types";

export function PromptEditorPanel({
  content,
  variables,
  onChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: {
  content: string;
  variables: PromptVariable[];
  onChange: (content: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  const handleContentChange = (value: string, caret: number) => {
    onChange(value);
    setCursorPosition(caret);
    setShowSuggestions(/\{\{[a-zA-Z0-9_]*$/.test(value.slice(0, caret)));
  };

  const insertVariable = (name: string) => {
    const beforeCaret = content.slice(0, cursorPosition);
    const afterCaret = content.slice(cursorPosition);
    const nextBeforeCaret = beforeCaret.replace(
      /\{\{[a-zA-Z0-9_]*$/,
      `{{${name}}}`,
    );
    const nextContent = nextBeforeCaret + afterCaret;
    const nextCaret = nextBeforeCaret.length;
    onChange(nextContent);
    setShowSuggestions(false);
    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCaret, nextCaret);
    }, 0);
  };

  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const editor = (
    <div className={cn("relative flex min-h-[520px] flex-1 flex-col", expanded && "min-h-0")}>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(event) =>
          handleContentChange(event.target.value, event.target.selectionStart)
        }
        placeholder={"Write your prompt here...\n\nUse {{variable_name}} to insert dynamic values."}
        spellCheck="false"
        className="min-h-[520px] flex-1 resize-none bg-transparent p-5 font-mono text-[13px] leading-6 text-slate-300 outline-none placeholder:text-slate-700"
        aria-label="Prompt content"
      />
      {showSuggestions && variables.length > 0 && (
        <div className="absolute bottom-5 left-5 z-10 w-64 overflow-hidden rounded-lg border border-white/[.1] bg-[#1c2128] p-1.5 shadow-2xl">
          <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-medium uppercase tracking-[.12em] text-slate-600">
            <Sparkles className="size-3 text-violet-400" /> Insert variable
          </div>
          {variables.map((variable) => (
            <button
              type="button"
              key={variable.id}
              onClick={() => insertVariable(variable.name)}
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition hover:bg-white/[.05]"
            >
              <span className="font-mono text-xs text-violet-300">{`{{${variable.name}}}`}</span>
              <span className="text-[9px] text-slate-700">{variable.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22]">
        <div className="flex h-12 items-center border-b border-white/[.07] px-3">
          <div className="flex items-center gap-1">
            <EditorTool label="Undo" onClick={onUndo} disabled={!canUndo}><Undo2 /></EditorTool>
            <EditorTool label="Redo" onClick={onRedo} disabled={!canRedo}><Redo2 /></EditorTool>
            <span className="mx-1 h-5 w-px bg-white/[.07]" />
            <EditorTool label={copied ? "Copied" : "Copy"} onClick={copyContent}>{copied ? <Check className="text-emerald-400" /> : <Copy />}</EditorTool>
          </div>
          <span className="ml-auto hidden items-center gap-1.5 rounded-md bg-violet-500/[.07] px-2 py-1 text-[9px] text-violet-300 sm:inline-flex">
            <Clipboard className="size-3" /> Prompt editor
          </span>
          <EditorTool label="Expand" onClick={() => setExpanded(true)} className="ml-1"><Expand /></EditorTool>
        </div>
        {editor}
        <div className="flex h-9 items-center gap-4 border-t border-white/[.07] px-4 font-mono text-[9px] text-slate-700">
          <span>{content.length.toLocaleString()} characters</span>
          <span>{words.toLocaleString()} words</span>
          <span className="ml-auto hidden sm:inline">Type {"{{"} for variables</span>
        </div>
      </section>

      <Dialog.Root open={expanded} onOpenChange={setExpanded}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-4 z-[80] flex flex-col overflow-hidden rounded-xl border border-white/[.1] bg-[#161b22] shadow-2xl outline-none sm:inset-8" aria-describedby={undefined}>
            <div className="flex h-14 shrink-0 items-center border-b border-white/[.07] px-4">
              <Dialog.Title className="text-sm font-semibold text-slate-100">Prompt editor</Dialog.Title>
              <span className="ml-3 font-mono text-[10px] text-slate-700">{content.length} characters</span>
              <Dialog.Close asChild><Button variant="icon" size="icon" className="ml-auto size-8"><X className="size-4" /></Button></Dialog.Close>
            </div>
            {editor}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function EditorTool({
  label,
  children,
  onClick,
  disabled,
  className,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn("grid size-8 place-items-center rounded-md text-slate-600 transition hover:bg-white/[.05] hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30 [&_svg]:size-3.5", className)}
    >
      {children}
    </button>
  );
}
