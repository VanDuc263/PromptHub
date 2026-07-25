import * as Dialog from "@radix-ui/react-dialog";
import { Braces, FileText, Plus, Sparkles, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const templates = [
  { id: "blank", label: "Blank prompt", description: "Start from scratch", icon: FileText },
  { id: "variable", label: "With variables", description: "Add reusable inputs", icon: Braces },
  { id: "assist", label: "AI assisted", description: "Shape an initial draft", icon: Sparkles },
];

export function NewPromptDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (title: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("blank");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const promptTitle = title.trim() || "Untitled prompt";
    onCreate(promptTitle);
    setTitle("");
    setTemplate("blank");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none"
          aria-describedby="new-prompt-description"
        >
          <div className="flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-semibold tracking-[-.02em] text-slate-50">
                Create a new prompt
              </Dialog.Title>
              <Dialog.Description id="new-prompt-description" className="mt-1.5 text-xs leading-5 text-slate-500">
                Choose how you want to begin. You can refine everything later.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="text-xs font-medium text-slate-300" htmlFor="prompt-title">Prompt name</label>
            <input
              id="prompt-title"
              autoFocus
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Senior Code Reviewer"
              className="mt-2 h-11 w-full rounded-lg border border-white/[.09] bg-[#0d1117] px-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-700 focus:border-violet-500/70 focus:ring-2 focus:ring-violet-500/15"
            />

            <p className="mb-2 mt-5 text-xs font-medium text-slate-300">Start with</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {templates.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTemplate(item.id)}
                    className={cn(
                      "rounded-lg border p-3 text-left transition",
                      template === item.id
                        ? "border-violet-500/60 bg-violet-500/10"
                        : "border-white/[.07] bg-white/[.025] hover:border-white/[.13]",
                    )}
                  >
                    <Icon className={cn("size-4", template === item.id ? "text-violet-300" : "text-slate-600")} />
                    <span className="mt-3 block text-[11px] font-medium text-slate-200">{item.label}</span>
                    <span className="mt-1 block text-[10px] text-slate-600">{item.description}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild><Button type="button" variant="ghost">Cancel</Button></Dialog.Close>
              <Button type="submit"><Plus className="size-4" /> Create prompt</Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
