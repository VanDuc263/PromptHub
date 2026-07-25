import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, Clock3, FileText, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prompts } from "@/data/mock-data";

export function SearchDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (label: string) => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () =>
      prompts.filter((prompt) =>
        `${prompt.title} ${prompt.description} ${prompt.tags.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in" />
        <Dialog.Content
          className="fixed left-1/2 top-[14vh] z-[80] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-white/[.1] bg-[#161b22] shadow-2xl outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Search prompts</Dialog.Title>
          <div className="flex h-14 items-center gap-3 border-b border-white/[.08] px-4">
            <Search className="size-[18px] text-slate-500" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search prompts, tags, collections..."
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
            <kbd className="rounded border border-white/[.08] px-1.5 py-0.5 text-[10px] text-slate-600">ESC</kbd>
            <Dialog.Close asChild>
              <Button variant="icon" size="icon" className="size-7"><X className="size-4" /></Button>
            </Dialog.Close>
          </div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">
              {query ? `${results.length} results` : "Recent prompts"}
            </p>
            {results.map((prompt) => (
              <button
                type="button"
                key={prompt.id}
                onClick={() => {
                  onAction(`Opened ${prompt.title}`);
                  onOpenChange(false);
                }}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-white/[.05]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[.07] bg-white/[.03] text-slate-500">
                  <FileText className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-slate-200">{prompt.title}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    {prompt.tags.slice(0, 2).map((tag) => <Badge key={tag} className="px-1.5 py-0 text-[9px]">{tag}</Badge>)}
                  </span>
                </span>
                {!query && <Clock3 className="size-3.5 text-slate-700" />}
                <ArrowUpRight className="size-4 text-slate-700 opacity-0 transition group-hover:text-violet-400 group-hover:opacity-100" />
              </button>
            ))}
            {results.length === 0 && (
              <div className="py-12 text-center">
                <Search className="mx-auto size-5 text-slate-700" />
                <p className="mt-3 text-xs text-slate-500">No prompts found for “{query}”</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-white/[.07] px-4 py-2.5 text-[10px] text-slate-600">
            <span>↑↓ Navigate</span><span>↵ Open</span><span>Esc Close</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
