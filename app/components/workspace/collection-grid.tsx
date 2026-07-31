import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Eye, Folder, LockKeyhole, MoreHorizontal, Pencil, Plus, Share2, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WorkspaceCollection } from "@/data/workspace-data";

const coverTones = {
  violet: "border-violet-400/15 bg-violet-500/[.075] text-violet-400",
  sky: "border-sky-400/15 bg-sky-500/[.075] text-sky-400",
  emerald: "border-emerald-400/15 bg-emerald-500/[.075] text-emerald-400",
  amber: "border-amber-400/15 bg-amber-500/[.06] text-amber-300",
  slate: "border-slate-400/15 bg-slate-500/[.07] text-slate-400",
  rose: "border-rose-400/15 bg-rose-500/[.06] text-rose-300",
};

export function CollectionGrid({
  collections,
  onCreate,
  onAction,
}: {
  collections: WorkspaceCollection[];
  onCreate: () => void;
  onAction: (label: string) => void;
}) {
  if (!collections.length) {
    return (
      <div className="rounded-xl border border-dashed border-white/[.08] px-6 py-20 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-violet-500/[.06]"><Folder className="size-7 text-violet-400/60" /></div>
        <h3 className="mt-4 text-sm font-semibold text-slate-300">No collections created.</h3>
        <p className="mt-1 text-xs text-slate-600">Create a collection to organize this workspace&apos;s prompts.</p>
        <Button size="sm" className="mt-5" onClick={onCreate}><Plus className="size-4" /> Create Collection</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-sm font-semibold text-slate-100">Workspace Collections</h2><p className="mt-1 text-xs text-slate-600">Shared resources organized for your team.</p></div>
        <Button onClick={onCreate}><Plus className="size-4" /> Create Collection</Button>
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <motion.article
            key={collection.id}
            whileHover={{ y: -4 }}
            className="group overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22] transition-colors hover:border-violet-400/20"
          >
            <div className={cn("relative flex h-28 items-center justify-center overflow-hidden border-b", coverTones[collection.tone])}>
              <Folder className="size-9" strokeWidth={1.5} />
              <span className="absolute -right-6 -top-8 size-24 rounded-full border border-current opacity-[.08]" />
              <span className="absolute -bottom-8 -left-6 size-20 rounded-full border border-current opacity-[.06]" />
              <CollectionActions name={collection.name} onAction={onAction} />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0"><h3 className="truncate text-sm font-semibold text-slate-200">{collection.name}</h3><p className="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-slate-600">{collection.description}</p></div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/[.055] pt-3">
                <span className="text-[10px] text-slate-500">{collection.prompts} prompts</span>
                <Badge className="gap-1 text-[9px]">
                  {collection.visibility === "Private" ? <LockKeyhole className="size-2.5" /> : collection.visibility === "Workspace" ? <Users className="size-2.5" /> : <Eye className="size-2.5" />}
                  {collection.visibility}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex -space-x-1.5">
                  {collection.collaborators.map((initials) => <Avatar key={initials} initials={initials} className="size-6 border-2 border-[#161b22] text-[8px]" />)}
                </div>
                <span className="text-[9px] text-slate-700">Updated {collection.updated}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}

function CollectionActions({ name, onAction }: { name: string; onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="icon" size="icon" className="absolute right-3 top-3 size-8 border border-white/10 bg-[#0d1117]/70 opacity-0 backdrop-blur-md group-hover:opacity-100" aria-label={`Actions for ${name}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={5} className="dropdown-content w-44 p-1.5">
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`${name} opened`)}><Eye /> Open</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Edit ${name}`)}><Pencil /> Edit</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Share ${name}`)}><Share2 /> Share</DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item text-rose-400" onSelect={() => onAction(`Delete ${name}`)}><Trash2 /> Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
