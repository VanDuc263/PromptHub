import { Check, ChevronDown, Copy, Eye, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldLabel, SelectField, TextAreaField, TextField } from "@/components/prompt-editor/field";
import { cn } from "@/lib/utils";
import type { PromptVariable } from "@/types";

export function LivePreviewPanel({
  content,
  variables,
  values,
  collapsed,
  onToggle,
  onValuesChange,
}: {
  content: string;
  variables: PromptVariable[];
  values: Record<string, string>;
  collapsed: boolean;
  onToggle: () => void;
  onValuesChange: (values: Record<string, string>) => void;
}) {
  const [copied, setCopied] = useState(false);

  const generatedPrompt = useMemo(
    () =>
      content.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, name: string) => {
        const value = values[name]?.trim();
        return value || `[${name}]`;
      }),
    [content, values],
  );

  const reset = () => {
    onValuesChange(Object.fromEntries(variables.map((variable) => [variable.name, ""])));
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <aside id="live-preview" className="rounded-xl border border-white/[.07] bg-[#161b22] xl:sticky xl:top-[96px] xl:self-start">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-3.5 text-left xl:pointer-events-none"
        aria-expanded={!collapsed}
      >
        <Eye className="size-4 text-violet-400" />
        <span className="text-xs font-semibold text-slate-200">Live preview</span>
        <span className="ml-1 size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(34,197,94,.45)]" />
        <ChevronDown className={cn("ml-auto size-4 text-slate-600 transition-transform xl:hidden", !collapsed && "rotate-180")} />
      </button>

      <div className={cn("border-t border-white/[.07]", collapsed ? "hidden xl:block" : "block")}>
        <div className="space-y-4 p-4">
          {variables.length === 0 ? (
            <div className="rounded-lg border border-dashed border-white/[.08] py-7 text-center">
              <p className="text-[11px] text-slate-600">Add a variable to test your prompt.</p>
            </div>
          ) : (
            variables.map((variable) => (
              <div key={variable.id}>
                <FieldLabel optional={!variable.required}>
                  <span>
                    {variable.label || variable.name}
                    {variable.required && <span className="ml-1 text-violet-400">*</span>}
                  </span>
                </FieldLabel>
                {variable.type === "Long Text" ? (
                  <TextAreaField
                    rows={4}
                    value={values[variable.name] ?? ""}
                    placeholder={variable.placeholder}
                    onChange={(event) => onValuesChange({ ...values, [variable.name]: event.target.value })}
                  />
                ) : variable.type === "Select" ? (
                  <SelectField
                    value={values[variable.name] ?? ""}
                    onChange={(event) => onValuesChange({ ...values, [variable.name]: event.target.value })}
                  >
                    <option value="">{variable.placeholder}</option>
                    {(variable.options ?? ["Option one", "Option two"]).map((option) => <option key={option}>{option}</option>)}
                  </SelectField>
                ) : (
                  <TextField
                    type={variable.type === "Number" ? "number" : "text"}
                    value={values[variable.name] ?? ""}
                    placeholder={variable.placeholder}
                    onChange={(event) => onValuesChange({ ...values, [variable.name]: event.target.value })}
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/[.07] p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-600">Generated prompt</p>
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-[9px] text-slate-700 transition hover:text-slate-400">
              <RotateCcw className="size-3" /> Reset
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/[.07] bg-[#0d1117] p-3 font-mono text-[10px] leading-5 text-slate-500">
            {generatedPrompt || <span className="text-slate-700">Your generated prompt will appear here.</span>}
          </div>
          <Button variant="secondary" className="mt-3 w-full" onClick={copyPrompt}>
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy prompt"}
          </Button>
        </div>
      </div>
    </aside>
  );
}
