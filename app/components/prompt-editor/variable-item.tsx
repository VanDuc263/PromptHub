import { ChevronDown, GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/prompt-editor/field";
import { cn } from "@/lib/utils";
import type { PromptVariable, VariableType } from "@/types";

const variableTypes: VariableType[] = ["Text", "Long Text", "Number", "Select"];

export function VariableItem({
  variable,
  onChange,
  onDelete,
}: {
  variable: PromptVariable;
  onChange: (variable: PromptVariable) => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-lg border border-white/[.07] bg-white/[.02] p-3">
      <div className="flex items-center gap-2">
        <GripVertical className="size-3.5 shrink-0 text-slate-700" />
        <TextField
          value={variable.name}
          onChange={(event) =>
            onChange({
              ...variable,
              name: event.target.value.replace(/\s+/g, "_").toLowerCase(),
              label: event.target.value,
            })
          }
          aria-label="Variable name"
          className="h-8 border-0 bg-transparent px-1 font-mono text-[11px] focus:ring-0"
        />
        <Button variant="icon" size="icon" className="size-7 shrink-0 hover:text-red-300" onClick={onDelete} aria-label={`Delete ${variable.name}`}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <div className="relative">
          <select
            value={variable.type}
            onChange={(event) => onChange({ ...variable, type: event.target.value as VariableType })}
            aria-label="Variable type"
            className="h-8 w-full appearance-none rounded-md border border-white/[.07] bg-[#0d1117] px-2.5 pr-7 text-[10px] text-slate-400 outline-none focus:border-violet-500/50"
          >
            {variableTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-slate-700" />
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={variable.required}
          onClick={() => onChange({ ...variable, required: !variable.required })}
          className="flex items-center gap-2 rounded-md px-1.5 text-[10px] text-slate-500"
        >
          Required
          <span className={cn("relative h-4 w-7 rounded-full transition", variable.required ? "bg-violet-500" : "bg-white/[.1]")}>
            <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-transform", variable.required ? "translate-x-3.5" : "translate-x-0.5")} />
          </span>
        </button>
      </div>
    </div>
  );
}
