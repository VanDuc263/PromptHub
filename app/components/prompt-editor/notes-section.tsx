import { ChevronDown, NotebookPen } from "lucide-react";
import { useState } from "react";
import { TextAreaField } from "@/components/prompt-editor/field";
import { cn } from "@/lib/utils";

export function NotesSection({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (notes: string) => void;
}) {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-white/[.07] bg-[#161b22]">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex w-full items-center gap-2 px-4 py-3.5 text-left" aria-expanded={open}>
        <NotebookPen className="size-4 text-slate-500" />
        <span className="text-xs font-semibold text-slate-300">Notes</span>
        <span className="text-[10px] text-slate-700">Optional</span>
        <ChevronDown className={cn("ml-auto size-4 text-slate-600 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="border-t border-white/[.07] p-4">
          <TextAreaField
            value={notes}
            onChange={(event) => onChange(event.target.value)}
            rows={5}
            placeholder="Document when to use this prompt, expected inputs, limitations, or helpful examples..."
          />
        </div>
      )}
    </section>
  );
}
