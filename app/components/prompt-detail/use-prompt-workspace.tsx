import {
  Bot,
  Check,
  Copy,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { FieldLabel, SelectField, TextAreaField, TextField } from "@/components/prompt-editor/field";
import { Button } from "@/components/ui/button";
import { detailVariables, promptTemplate } from "@/data/prompt-detail-data";
import type { PromptDetailVariable } from "@/types";

export function UsePromptWorkspace({
  onAction,
  template = promptTemplate,
  systemMessage = "",
  variables = detailVariables,
  filename = "generated-prompt.txt",
}: {
  onAction: (label: string) => void;
  template?: string;
  systemMessage?: string;
  variables?: PromptDetailVariable[];
  filename?: string;
}) {
  const initialValues = Object.fromEntries(
    variables.map((variable) => [variable.name, variable.defaultValue]),
  );
  const [values, setValues] = useState<Record<string, string>>(() => initialValues);
  const [copied, setCopied] = useState(false);
  const missingRequired = variables.filter(
    (variable) => variable.required && !values[variable.name]?.trim(),
  );

  const renderedPrompt = useMemo(
    () => {
      const render = (source: string) => source.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, name: string) => {
        return values[name]?.trim() || `[Missing: ${name}]`;
      });
      const renderedTemplate = render(template);
      const renderedSystemMessage = render(systemMessage);
      return renderedSystemMessage
        ? `System message:\n${renderedSystemMessage}\n\nUser prompt:\n${renderedTemplate}`
        : renderedTemplate;
    },
    [systemMessage, template, values],
  );

  const copyPrompt = async () => {
    if (missingRequired.length) return;
    await navigator.clipboard.writeText(renderedPrompt);
    setCopied(true);
    onAction("Generated prompt copied");
    window.setTimeout(() => setCopied(false), 1600);
  };

  const downloadPrompt = () => {
    if (missingRequired.length) return;
    const blob = new Blob([renderedPrompt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    onAction("Prompt downloaded");
  };

  const resetValues = () => {
    setValues(initialValues);
    onAction("Variable values reset");
  };

  const generatePrompt = () => {
    if (missingRequired.length) {
      onAction("Complete the required source code field");
      return;
    }
    document.getElementById("generated-prompt")?.scrollIntoView({ behavior: "smooth", block: "center" });
    onAction("Prompt generated");
  };

  return (
    <div className="space-y-4">
      <section id="use-prompt" className="rounded-xl border border-white/[.07] bg-[#161b22]">
        <div className="flex items-center gap-3 border-b border-white/[.07] px-5 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-violet-500/10 text-violet-300"><Play className="size-4 fill-current" /></span>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Use prompt</h2>
            <p className="mt-0.5 text-[9px] text-slate-700">Enter variable values to render the final prompt</p>
          </div>
        </div>
        <div className="grid gap-5 p-5 lg:grid-cols-2">
          {variables.map((variable) => (
            <div key={variable.name} className={variable.name === "source_code" || variable.name === "requirements" ? "lg:col-span-2" : ""}>
              <FieldLabel optional={!variable.required}>
                <span>{variable.label}{variable.required && <span className="ml-1 text-violet-400">*</span>}</span>
              </FieldLabel>
              {variable.type === "Long Text" ? (
                <TextAreaField
                  rows={variable.name === "source_code" ? 8 : 4}
                  value={values[variable.name]}
                  onChange={(event) => setValues({ ...values, [variable.name]: event.target.value })}
                  placeholder={variable.placeholder}
                  className={missingRequired.some((item) => item.name === variable.name) ? "border-amber-500/25 focus:border-amber-500/50" : ""}
                />
              ) : variable.type === "Select" ? (
                <SelectField value={values[variable.name]} onChange={(event) => setValues({ ...values, [variable.name]: event.target.value })}>
                  {variable.options?.map((option) => <option key={option}>{option}</option>)}
                </SelectField>
              ) : (
                <TextField value={values[variable.name]} onChange={(event) => setValues({ ...values, [variable.name]: event.target.value })} placeholder={variable.placeholder} />
              )}
              {variable.required && !values[variable.name]?.trim() && (
                <p className="mt-1.5 flex items-center gap-1 text-[9px] text-amber-400/80"><TriangleAlert className="size-3" /> Required to generate the prompt</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-white/[.07] px-5 py-4 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={resetValues}><RotateCcw className="size-4" /> Reset values</Button>
          <Button onClick={generatePrompt}><Sparkles className="size-4" /> Generate prompt</Button>
        </div>
      </section>

      <section id="generated-prompt" className="overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22]">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[.07] px-5 py-4">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300"><Bot className="size-4" /></span>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Generated prompt</h2>
            <p className="mt-0.5 text-[9px] text-slate-700">Live preview with variables rendered</p>
          </div>
          {!missingRequired.length && <span className="ml-auto inline-flex items-center gap-1 text-[9px] text-emerald-400"><span className="size-1.5 rounded-full bg-emerald-400" /> Ready</span>}
        </div>

        {missingRequired.length ? (
          <div className="px-5 py-14 text-center">
            <span className="mx-auto grid size-10 place-items-center rounded-lg bg-amber-500/[.08] text-amber-400"><TriangleAlert className="size-[18px]" /></span>
            <h3 className="mt-4 text-sm font-medium text-slate-300">Complete required variables</h3>
            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-slate-600">
              Complete the highlighted fields above to generate the final prompt.
            </p>
          </div>
        ) : (
          <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap bg-[#0d1117]/60 p-5 font-mono text-xs leading-6 text-slate-400 sm:p-6">{renderedPrompt}</pre>
        )}

        <div className="flex flex-wrap gap-2 border-t border-white/[.07] p-4">
          <Button variant="secondary" onClick={copyPrompt} disabled={Boolean(missingRequired.length)}>
            {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy prompt"}
          </Button>
          <Button variant="ghost" onClick={downloadPrompt} disabled={Boolean(missingRequired.length)}><Download className="size-4" /> Download .txt</Button>
          <div className="h-8 w-px bg-white/[.07]" />
          {["ChatGPT", "Claude", "Gemini"].map((provider) => (
            <Button key={provider} variant="ghost" onClick={() => onAction(`Open in ${provider} selected`)} disabled={Boolean(missingRequired.length)}>
              <ExternalLink className="size-3.5" /> Open in {provider}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
