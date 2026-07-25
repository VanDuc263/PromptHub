import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Archive,
  ArrowLeft,
  ChevronDown,
  CopyPlus,
  Edit3,
  Ellipsis,
  FolderInput,
  Heart,
  Play,
  Share2,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DetailHeader({
  favorite,
  onBack,
  onFavorite,
  onShare,
  onEdit,
  onUse,
  onAction,
  onDelete,
}: {
  favorite: boolean;
  onBack: () => void;
  onFavorite: () => void;
  onShare: () => void;
  onEdit: () => void;
  onUse: () => void;
  onAction: (label: string) => void;
  onDelete: () => void;
}) {
  return (
    <header className="border-b border-white/[.07] pb-5">
      <div className="flex items-start gap-3">
        <Button variant="icon" size="icon" onClick={onBack} aria-label="Back to My Prompts">
          <ArrowLeft className="size-[18px]" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="mr-1 truncate text-xl font-semibold tracking-[-.025em] text-slate-50 sm:text-2xl">
              Java Code Reviewer
            </h1>
            <Badge className="border-white/[.08] bg-white/[.035] text-slate-400">Private</Badge>
            <Badge className="border-violet-500/20 bg-violet-500/[.08] font-mono text-violet-300">v4</Badge>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-600">Updated 2 hours ago</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button variant="icon" size="icon" onClick={onFavorite} aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
            <Heart className={cn("size-[17px]", favorite && "fill-rose-400 text-rose-400")} />
          </Button>
          <Button variant="icon" size="icon" onClick={onShare} aria-label="Share prompt">
            <Share2 className="size-[17px]" />
          </Button>
          <PromptMenu onAction={onAction} onDelete={onDelete} />
          <Button variant="secondary" onClick={onEdit}><Edit3 className="size-4" /> Edit prompt</Button>
          <Button onClick={onUse}><Play className="size-4 fill-current" /> Use prompt</Button>
        </div>

        <div className="lg:hidden">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary" size="sm">Actions <ChevronDown className="size-3.5" /></Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={7} className="dropdown-content w-48 p-1.5">
                <DropdownMenu.Item className="dropdown-item" onSelect={onUse}><Play /> Use prompt</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item" onSelect={onEdit}><Edit3 /> Edit prompt</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item" onSelect={onFavorite}><Heart /> {favorite ? "Unfavorite" : "Favorite"}</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item" onSelect={onShare}><Share2 /> Share</DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
                <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Prompt duplicated")}><CopyPlus /> Duplicate</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Collection picker opened")}><FolderInput /> Move to collection</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Prompt archived")}><Archive /> Archive</DropdownMenu.Item>
                <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={onDelete}><Trash2 /> Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
}

function PromptMenu({
  onAction,
  onDelete,
}: {
  onAction: (label: string) => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="icon" size="icon" aria-label="More prompt actions"><Ellipsis className="size-[18px]" /></Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={7} className="dropdown-content w-48 p-1.5">
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Prompt duplicated")}><CopyPlus /> Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Collection picker opened")}><FolderInput /> Move to collection</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Prompt archived")}><Archive /> Archive</DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item text-red-300" onSelect={onDelete}><Trash2 /> Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
