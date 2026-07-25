import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Copy,
  Eye,
  FilePenLine,
  Globe2,
  Heart,
  LockKeyhole,
  MoreHorizontal,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCompact } from "@/lib/utils";
import type { LibraryPrompt } from "@/types";

const visibilityIcons = {
  Private: LockKeyhole,
  Public: Globe2,
  Team: Users,
};

export function PromptListItem({
  prompt,
  onAction,
}: {
  prompt: LibraryPrompt;
  onAction: (label: string) => void;
}) {
  const VisibilityIcon = visibilityIcons[prompt.visibility];

  return (
    <article className="group relative grid gap-4 rounded-xl border border-white/[.07] bg-[#161b22] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-violet-500/35 hover:bg-[#181e26] hover:shadow-[0_12px_32px_rgba(0,0,0,.16)] md:grid-cols-[minmax(0,1fr)_130px_100px_145px_40px] md:items-center md:gap-5 md:px-5">
      <span className={cn("absolute bottom-4 left-0 top-4 w-0.5 rounded-r opacity-70", prompt.accent)} />
      <button type="button" onClick={() => onAction(`Opened ${prompt.title}`)} className="min-w-0 text-left outline-none">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-slate-100 transition group-hover:text-violet-200">{prompt.title}</h3>
          {prompt.status === "Draft" && (
            <Badge className="border-amber-500/15 bg-amber-500/[.07] py-0.5 text-amber-400">Draft</Badge>
          )}
        </div>
        <p className="mt-1.5 truncate text-xs text-slate-500">{prompt.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 md:hidden">
          {prompt.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </button>

      <div className="hidden items-center gap-1.5 text-xs text-slate-500 md:flex">
        <VisibilityIcon className="size-3.5" />
        {prompt.visibility}
      </div>
      <div className="hidden md:block">
        <span className="rounded-md border border-white/[.06] bg-white/[.03] px-2 py-1 font-mono text-[11px] text-slate-500">{prompt.version}</span>
      </div>
      <div className="hidden md:block">
        <p className="text-xs text-slate-500">{prompt.updatedAt === "2h ago" ? "Updated 2 hours ago" : `Updated ${prompt.updatedAt}`}</p>
        <p className="mt-1.5 flex items-center gap-3 text-[10px] text-slate-700">
          <span>{formatCompact(prompt.uses)} uses</span>
          <span className="inline-flex items-center gap-1"><Heart className="size-3" /> {prompt.favorites}</span>
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-white/[.06] pt-3 md:border-0 md:pt-0">
        <div className="flex items-center gap-3 text-[11px] text-slate-600 md:hidden">
          <span className="inline-flex items-center gap-1.5"><VisibilityIcon className="size-3.5" />{prompt.visibility}</span>
          <span>{prompt.version}</span>
          <span>{prompt.updatedAt}</span>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="icon" size="icon" className="size-9" aria-label={`Actions for ${prompt.title}`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={6} className="dropdown-content w-44 p-1.5">
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Opened ${prompt.title}`)}><Eye /> Open</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Editing ${prompt.title}`)}><FilePenLine /> Edit</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Copied ${prompt.title}`)}><Copy /> Duplicate</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Sharing ${prompt.title}`)}><Share2 /> Share</DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
              <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={() => onAction(`Delete requested for ${prompt.title}`)}><Trash2 /> Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </article>
  );
}
