import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none" aria-describedby="delete-description">
          <div className="flex items-start justify-between">
            <span className="grid size-10 place-items-center rounded-lg bg-red-500/10 text-red-400"><AlertTriangle className="size-[18px]" /></span>
            <Dialog.Close asChild><Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button></Dialog.Close>
          </div>
          <Dialog.Title className="mt-5 text-lg font-semibold text-slate-50">Delete this prompt?</Dialog.Title>
          <Dialog.Description id="delete-description" className="mt-2 text-xs leading-5 text-slate-500">
            Java Code Reviewer and its version history will be permanently removed. This action cannot be undone.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild><Button variant="ghost">Cancel</Button></Dialog.Close>
            <Button
              className="bg-red-500 shadow-[0_8px_24px_rgba(239,68,68,.16)] hover:bg-red-600"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              <Trash2 className="size-4" /> Delete prompt
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
