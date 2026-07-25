import * as Dialog from "@radix-ui/react-dialog";
import { History, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function RestoreVersionDialog({
  open,
  version,
  loading,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  version: string;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => !loading && onOpenChange(nextOpen)}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm" />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-describedby="restore-version-description">
              <motion.div
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="fixed left-1/2 top-1/2 z-[120] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400"><History className="size-[18px]" /></span>
                  <Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8" onClick={() => onOpenChange(false)} disabled={loading} aria-label="Close"><X className="size-4" /></Button>
                </div>
                <Dialog.Title className="mt-5 text-lg font-semibold text-slate-50">Restore Version {version}?</Dialog.Title>
                <Dialog.Description id="restore-version-description" className="mt-2 text-xs leading-5 text-slate-500">
                  The current draft will be replaced with this version. Your existing version history will remain available.
                </Dialog.Description>
                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
                  <Button className="bg-amber-500 text-[#171004] shadow-[0_8px_24px_rgba(245,158,11,.16)] hover:bg-amber-400" onClick={onConfirm} disabled={loading}>
                    {loading ? <LoaderCircle className="size-4 animate-spin" /> : <History className="size-4" />}
                    {loading ? "Restoring..." : "Restore version"}
                  </Button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
