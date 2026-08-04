import {
  Bookmark,
  CheckCircle2,
  ChevronRight,
  Copy,
  GitFork,
  FolderPlus,
  Heart,
  Library,
  Play,
  Share2,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublicPromptData } from "@/context/public-prompt-context";

export function PublicPromptHeader({
  saved,
  bookmarked,
  liked,
  onBack,
  onSave,
  onUse,
  onBookmark,
  onLike,
  onFork,
  onCopy,
  onAction,
  onViewProfile,
}: {
  saved: boolean;
  bookmarked: boolean;
  liked: boolean;
  onBack: () => void;
  onSave: () => void;
  onUse: () => void;
  onBookmark: () => void;
  onLike: () => void;
  onFork: () => void;
  onCopy: () => void;
  onAction: (label: string) => void;
  onViewProfile: () => void;
}) {
  const { prompt: publicPrompt } = usePublicPromptData();
  return (
    <>
      <motion.header initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] text-slate-700">
          <button type="button" onClick={onBack} className="transition hover:text-emerald-400">Explore</button>
          <ChevronRight className="size-3" />
          <span>Programming</span>
          <ChevronRight className="size-3" />
          <span className="truncate text-slate-500">{publicPrompt.title}</span>
        </nav>

        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold tracking-[-.035em] text-slate-50 sm:text-4xl">{publicPrompt.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{publicPrompt.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 text-[10px] text-slate-600">
              <button type="button" onClick={onViewProfile} className="inline-flex items-center gap-2 rounded-lg outline-none transition hover:text-violet-300 focus-visible:ring-2 focus-visible:ring-violet-500/50">
                <Avatar initials={publicPrompt.authorInitials} className="size-7 text-[9px]" />
                <strong className="font-medium text-slate-300">{publicPrompt.author}</strong>
                {publicPrompt.verified && <CheckCircle2 className="size-3.5 fill-sky-400/15 text-sky-400" aria-label="Verified creator" />}
              </button>
              <span>{publicPrompt.publishedAt}</span>
              <span>{publicPrompt.updatedAt}</span>
              <Badge>{publicPrompt.category}</Badge>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className="mr-1 text-[9px] text-slate-700">Compatible with</span>
              {publicPrompt.models.map((model) => (
                <span key={model} className="rounded-md border border-emerald-500/10 bg-emerald-500/[.04] px-2 py-1 text-[9px] text-emerald-300/75">{model}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      <div className="sticky top-[72px] z-20 mt-6 flex flex-wrap gap-2 rounded-2xl border border-white/[.1] bg-[#0d1117]/90 p-3 shadow-[0_12px_38px_rgba(0,0,0,.25)] backdrop-blur-xl">
        <Button
          variant="secondary"
          className={cn(saved && "border-emerald-500/25 text-emerald-300")}
          onClick={onSave}
        >
          {saved ? <CheckCircle2 className="size-4" /> : <Library className="size-4" />}
          {saved ? "Saved to Library" : "Save to My Library"}
        </Button>
        <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={onUse}>
          <Play className="size-4 fill-current" /> Use prompt
        </Button>
        <Button variant="secondary" onClick={onFork}><GitFork className="size-4" /> Fork prompt</Button>
        <Button variant="secondary" onClick={onCopy}><Copy className="size-4" /> Copy prompt</Button>
        <Button variant="secondary" onClick={() => onAction(`Add ${publicPrompt.title} to collection`)}><FolderPlus className="size-4" /> Add to Collection</Button>
        <Button variant="ghost" onClick={() => onAction("Share link copied")}><Share2 className="size-4" /><span className="hidden sm:inline">Share</span></Button>
        <Button variant="ghost" onClick={() => onAction("Report dialog opened")}><ShieldAlert className="size-4" /><span className="hidden md:inline">Report</span></Button>
        <Button variant="icon" size="icon" onClick={onBookmark} aria-label={bookmarked ? "Remove from Saved" : "Save prompt"}>
          <Bookmark className={cn("size-4", bookmarked && "fill-emerald-400 text-emerald-400")} />
        </Button>
        <Button variant="ghost" onClick={onLike}>
          <Heart className={cn("size-4", liked && "fill-rose-400 text-rose-400")} />
          <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
        </Button>
      </div>
    </>
  );
}
