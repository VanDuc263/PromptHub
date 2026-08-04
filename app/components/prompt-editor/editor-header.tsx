import { ArrowLeft, Check, Cloud, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EditorHeader({
  saveStatus,
  onBack,
  onPreview,
  onSaveDraft,
  onSubmit,
  saving,
  editing,
  promptTitle,
}: {
  saveStatus: "Saved" | "Saving...";
  onBack: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  saving: boolean;
  editing: boolean;
  promptTitle: string;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/[.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Button variant="icon" size="icon" onClick={onBack} aria-label="Back to My Prompts">
          <ArrowLeft className="size-[18px]" />
        </Button>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-xl font-semibold tracking-[-.025em] text-slate-50">
              {editing ? "Edit Prompt" : "Create Prompt"}
            </h1>
            <span className="hidden items-center gap-1.5 text-[11px] text-slate-600 sm:flex">
              {saveStatus === "Saved" ? (
                <Check className="size-3.5 text-emerald-400" />
              ) : (
                <Cloud className="size-3.5 animate-pulse text-violet-400" />
              )}
              {saveStatus}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-600">{promptTitle.trim() || "Untitled prompt"} · Personal workspace</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="mr-auto inline-flex items-center gap-1.5 text-[11px] text-slate-600 sm:hidden">
          {saveStatus === "Saved" ? <Check className="size-3.5 text-emerald-400" /> : <Cloud className="size-3.5 animate-pulse text-violet-400" />}
          {saveStatus}
        </span>
        <Button variant="ghost" className="hidden sm:inline-flex" onClick={onPreview}>
          <Eye className="size-4" /> Preview
        </Button>
        <Button variant="secondary" onClick={onSaveDraft} disabled={saving}>
          <Save className="size-4" /><span className="hidden sm:inline">Save draft</span>
        </Button>
        <Button onClick={onSubmit} disabled={saving}>
          {editing ? "Save changes" : "Create"}
        </Button>
      </div>
    </header>
  );
}
