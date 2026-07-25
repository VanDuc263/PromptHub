import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Copy,
  Bookmark,
  ExternalLink,
  FolderPlus,
  LockKeyhole,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  Users,
  Globe2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCompact } from "@/lib/utils";
import type { Prompt } from "@/types";

const visibilityIcons = {
  Private: LockKeyhole,
  Public: Globe2,
  Team: Users,
};

export function PromptCard({
  prompt,
  onAction,
}: {
  prompt: Prompt;
  onAction: (label: string) => void;
}) {
  const VisibilityIcon = visibilityIcons[prompt.visibility];
  return (
    <article className="card-hover group relative flex min-h-[236px] flex-col overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22] p-5">
      <span className={`absolute inset-x-0 top-0 h-px opacity-60 ${prompt.accent}`} />
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-slate-100">{prompt.title}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{prompt.description}</p>
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8" aria-label={`Actions for ${prompt.title}`}>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content align="end" sideOffset={6} className="dropdown-content w-44 p-1.5">
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Opened ${prompt.title}`)}><ExternalLink /> Open prompt</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Copied ${prompt.title}`)}><Copy /> Copy</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Sharing ${prompt.title}`)}><Share2 /> Share</DropdownMenu.Item>
              <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Add ${prompt.title} to collection`)}><FolderPlus /> Add to Collection</DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
              <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={() => onAction(`Delete requested for ${prompt.title}`)}><Trash2 /> Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {prompt.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>

      <div className="mt-auto pt-5">
        <div className="flex items-center gap-3 border-t border-white/[.06] pt-4 text-[11px] text-slate-600">
          <span className="inline-flex items-center gap-1.5 text-slate-500"><VisibilityIcon className="size-3.5" />{prompt.visibility}</span>
          <span className="rounded bg-white/[.04] px-1.5 py-0.5 text-slate-500">{prompt.version}</span>
          <span>{prompt.updatedAt}</span>
          <span className="ml-auto">{formatCompact(prompt.uses)} uses</span>
          <span className="inline-flex items-center gap-1"><Bookmark className="size-3.5" /> {prompt.saves}</span>
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-3 flex translate-y-3 items-center justify-end gap-1 rounded-lg border border-white/[.08] bg-[#1c2128]/95 p-1 opacity-0 shadow-xl backdrop-blur transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        <Button variant="ghost" size="sm" onClick={() => onAction(`Opened ${prompt.title}`)}><ExternalLink className="size-3.5" /> Open</Button>
        <Button variant="ghost" size="sm" onClick={() => onAction(`Copied ${prompt.title}`)}><Copy className="size-3.5" /> Copy</Button>
        <Button variant="ghost" size="sm" onClick={() => onAction(`Editing ${prompt.title}`)}><Pencil className="size-3.5" /> Edit</Button>
      </div>
    </article>
  );
}
