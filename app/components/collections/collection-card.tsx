import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Copy, Edit3, Eye, Globe2, LockKeyhole, MoreHorizontal, Share2, Trash2, Users, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";
import type { PromptCollection } from "@/types";

const visibilityIcons: Record<PromptCollection["visibility"], LucideIcon> = { Private: LockKeyhole, Public: Globe2, Team: Users };
const tones: Record<string, string> = {
  emerald: "from-emerald-500/25 to-cyan-500/5 text-emerald-300",
  violet: "from-violet-500/25 to-fuchsia-500/5 text-violet-300",
  sky: "from-sky-500/25 to-blue-500/5 text-sky-300",
  amber: "from-amber-500/25 to-orange-500/5 text-amber-300",
  rose: "from-rose-500/25 to-pink-500/5 text-rose-300",
  fuchsia: "from-fuchsia-500/25 to-violet-500/5 text-fuchsia-300",
};

export function CollectionCard({
  collection,
  list,
  onOpen,
  onEdit,
  onShare,
  onDuplicate,
  onDelete,
  onDropPrompt,
}: {
  collection: PromptCollection;
  list: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDropPrompt: (promptId: string) => void;
}) {
  const VisibilityIcon = visibilityIcons[collection.visibility];
  const coverImage = collection.localCoverImageUrl ?? collection.coverImageUrl;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const promptId = event.dataTransfer.getData("text/prompt-id");
        if (promptId) onDropPrompt(promptId);
      }}
      className={cn("group overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22] shadow-lg shadow-black/5 transition hover:border-emerald-500/20 hover:shadow-black/25", list && "sm:grid sm:grid-cols-[220px_minmax(0,1fr)]")}
    >
      <div className={cn("relative h-32 overflow-hidden border-b border-white/[.06] bg-gradient-to-br", tones[collection.color] ?? tones.emerald, list && "sm:h-full sm:min-h-52 sm:border-b-0 sm:border-r")}>
        {coverImage && <img src={coverImage} alt="" className="absolute inset-0 size-full object-cover" />}
        {coverImage && <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117]/75 via-transparent to-black/10" />}
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute bottom-4 left-4 flex -space-x-3">
          {collection.promptIds.slice(0, 4).map((id, index) => <span key={id} className="grid size-9 place-items-center rounded-lg border-2 border-[#161b22] bg-[#0d1117] font-mono text-[9px] text-slate-400">{["API", "CR", "SQL", "AI"][index]}</span>)}
        </div>
        <Badge className="absolute left-4 top-4 border-white/10 bg-[#0d1117]/75 backdrop-blur"><VisibilityIcon className="mr-1 size-3" />{collection.visibility}</Badge>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild><Button variant="icon" size="icon" className="absolute right-3 top-3 size-8 bg-[#0d1117]/70" aria-label={`Actions for ${collection.name}`}><MoreHorizontal className="size-4" /></Button></DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" className="z-50 min-w-44 rounded-lg border border-white/10 bg-[#1c2128] p-1 text-xs text-slate-300 shadow-2xl">
              <DropdownMenu.Item className="dropdown-item" onSelect={onOpen}><Eye /> Open collection</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={onShare}><Share2 /> Share</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={onDuplicate}><Copy /> Duplicate</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={onEdit}><Edit3 /> Edit</DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
              <DropdownMenu.Item className="dropdown-item text-rose-400" onSelect={onDelete}><Trash2 /> Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div className="min-w-0 p-4">
        <button type="button" onClick={onOpen} className="text-left outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"><h2 className="text-sm font-semibold text-slate-100 transition group-hover:text-emerald-200">{collection.name}</h2></button>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{collection.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">{collection.tags.map((tag) => <Badge key={tag} className="py-0.5 text-[9px]">{tag}</Badge>)}</div>
        <div className="mt-4 flex items-center border-t border-white/[.06] pt-3">
          <Avatar initials={collection.ownerInitials} className="size-7 text-[9px]" />
          <div className="ml-2"><p className="text-[10px] text-slate-400">{collection.owner}</p><p className="text-[8px] text-slate-700">Updated {collection.updatedAt.toLowerCase()}</p></div>
          <div className="ml-auto flex gap-3 text-[9px] text-slate-600"><span>{collection.promptIds.length} prompts</span><span>{formatCompact(collection.followers)} followers</span><span>{formatCompact(collection.views)} views</span></div>
        </div>
      </div>
    </motion.article>
  );
}
