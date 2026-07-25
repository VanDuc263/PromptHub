import * as Dialog from "@radix-ui/react-dialog";
import { BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RemoveSavedDialog({
  open,
  count,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  count: number;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[111] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl outline-none">
          <div className="grid size-11 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><BookmarkX className="size-5" /></div>
          <Dialog.Title className="mt-4 text-lg font-semibold text-slate-100">
            {count > 1 ? `Remove ${count} prompts from Saved?` : "Remove from Saved?"}
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-slate-500">
            {count > 1 ? "These prompts" : "This prompt"} will be removed from your saved library but will remain available in the community.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close>
            <Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={onConfirm}>Remove</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
