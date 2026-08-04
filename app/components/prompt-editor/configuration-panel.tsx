import { ChevronDown, Plus, Settings2, X } from "lucide-react";
import { useState } from "react";
import {
  FieldLabel,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/prompt-editor/field";
import { VariableItem } from "@/components/prompt-editor/variable-item";
import { Button } from "@/components/ui/button";
import {
  aiModels,
  promptCategories,
  promptLanguages,
  suggestedTags,
} from "@/data/mock-data";
import { cn } from "@/lib/utils";
import type { PromptEditorMetadata, PromptVariable } from "@/types";

export function ConfigurationPanel({
  metadata,
  variables,
  collapsed,
  onToggle,
  onMetadataChange,
  onVariablesChange,
}: {
  metadata: PromptEditorMetadata;
  variables: PromptVariable[];
  collapsed: boolean;
  onToggle: () => void;
  onMetadataChange: (metadata: PromptEditorMetadata) => void;
  onVariablesChange: (variables: PromptVariable[]) => void;
}) {
  const [tagInput, setTagInput] = useState("");

  const addVariable = () => {
    const nextIndex = variables.length + 1;
    onVariablesChange([
      ...variables,
      {
        id: `variable-${Date.now()}`,
        name: `variable_${nextIndex}`,
        label: `Variable ${nextIndex}`,
        type: "Text",
        required: false,
        placeholder: "Enter a value",
      },
    ]);
  };

  const addTag = (tag: string) => {
    const normalized = tag.trim();
    if (!normalized || metadata.tags.includes(normalized)) return;
    onMetadataChange({ ...metadata, tags: [...metadata.tags, normalized] });
    setTagInput("");
  };

  return (
    <aside className="rounded-xl border border-white/[.07] bg-[#161b22] xl:sticky xl:top-[96px] xl:self-start">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-4 py-3.5 text-left xl:pointer-events-none"
        aria-expanded={!collapsed}
      >
        <Settings2 className="size-4 text-violet-400" />
        <span className="text-xs font-semibold text-slate-200">Configuration</span>
        <ChevronDown className={cn("ml-auto size-4 text-slate-600 transition-transform xl:hidden", !collapsed && "rotate-180")} />
      </button>

      <div className={cn("border-t border-white/[.07] p-4", collapsed ? "hidden xl:block" : "block")}>
        <div>
          <FieldLabel>Prompt title</FieldLabel>
          <TextField
            value={metadata.title}
            onChange={(event) => onMetadataChange({ ...metadata, title: event.target.value })}
            placeholder="Untitled prompt"
          />
        </div>
        <div className="mt-4">
          <FieldLabel optional>Description</FieldLabel>
          <TextAreaField
            value={metadata.description}
            onChange={(event) => onMetadataChange({ ...metadata, description: event.target.value })}
            placeholder="What does this prompt do?"
            rows={3}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-1 2xl:grid-cols-2">
          <div>
            <FieldLabel>Category</FieldLabel>
            <SelectField value={metadata.category} onChange={(event) => onMetadataChange({ ...metadata, category: event.target.value })}>
              {promptCategories.map((category) => <option key={category}>{category}</option>)}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Visibility</FieldLabel>
            <SelectField value={metadata.visibility} onChange={(event) => onMetadataChange({ ...metadata, visibility: event.target.value as PromptEditorMetadata["visibility"] })}>
              <option>Private</option><option>Public</option>
            </SelectField>
          </div>
          <div>
            <FieldLabel>AI model</FieldLabel>
            <SelectField value={metadata.model} onChange={(event) => onMetadataChange({ ...metadata, model: event.target.value })}>
              {aiModels.map((model) => <option key={model}>{model}</option>)}
            </SelectField>
          </div>
          <div>
            <FieldLabel>Language</FieldLabel>
            <SelectField value={metadata.language} onChange={(event) => onMetadataChange({ ...metadata, language: event.target.value })}>
              {promptLanguages.map((language) => <option key={language}>{language}</option>)}
            </SelectField>
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel optional>Tags</FieldLabel>
          <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-white/[.08] bg-[#0d1117] p-1.5">
            {metadata.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-violet-500/10 px-2 py-1 text-[10px] text-violet-300">
                {tag}
                <button type="button" onClick={() => onMetadataChange({ ...metadata, tags: metadata.tags.filter((item) => item !== tag) })} aria-label={`Remove ${tag}`}>
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder={metadata.tags.length ? "Add..." : "Add tags..."}
              className="h-6 min-w-16 flex-1 bg-transparent px-1 text-[11px] text-slate-300 outline-none placeholder:text-slate-700"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {suggestedTags.filter((tag) => !metadata.tags.includes(tag)).slice(0, 3).map((tag) => (
              <button type="button" key={tag} onClick={() => addTag(tag)} className="text-[9px] text-slate-700 transition hover:text-slate-400">+ {tag}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-400">Variables</p>
            <p className="mt-0.5 text-[9px] text-slate-700">Reusable inputs for your prompt</p>
          </div>
          <Button variant="ghost" size="sm" onClick={addVariable}><Plus className="size-3.5" /> Add</Button>
        </div>
        <div className="mt-3 space-y-2">
          {variables.map((variable) => (
            <VariableItem
              key={variable.id}
              variable={variable}
              onChange={(nextVariable) => onVariablesChange(variables.map((item) => item.id === variable.id ? nextVariable : item))}
              onDelete={() => onVariablesChange(variables.filter((item) => item.id !== variable.id))}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
