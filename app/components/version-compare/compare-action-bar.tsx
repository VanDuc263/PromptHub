import { CopyPlus, Download, History, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompareActionBar({
  oldVersion,
  onRestore,
  onDuplicate,
  onExport,
  onCancel,
}: {
  oldVersion: string;
  onRestore: () => void;
  onDuplicate: () => void;
  onExport: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="sticky bottom-3 z-20 mt-6 flex flex-col gap-2 rounded-2xl border border-white/[.1] bg-[#161b22]/95 p-3 shadow-[0_16px_50px_rgba(0,0,0,.35)] backdrop-blur-xl sm:flex-row sm:items-center">
      <p className="hidden pl-2 text-[10px] text-slate-600 lg:block">Comparing changes is read-only until you restore or duplicate a version.</p>
      <div className="ml-auto flex flex-col gap-2 sm:flex-row">
        <Button variant="ghost" onClick={onCancel}><X className="size-4" /> Cancel</Button>
        <Button variant="ghost" onClick={onExport}><Download className="size-4" /> Export diff</Button>
        <Button variant="secondary" onClick={onDuplicate}><CopyPlus className="size-4" /> Duplicate new version</Button>
        <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={onRestore}><History className="size-4" /> Restore {oldVersion}</Button>
      </div>
    </div>
  );
}
