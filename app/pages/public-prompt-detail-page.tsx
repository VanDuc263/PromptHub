import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CommentsSection } from "@/components/public-prompt/comments-section";
import {
  CopyPublicPromptDialog,
  ForkPromptDialog,
} from "@/components/public-prompt/public-prompt-dialogs";
import { PublicPromptHeader } from "@/components/public-prompt/public-prompt-header";
import { PublicPromptSidebar } from "@/components/public-prompt/public-prompt-sidebar";
import { PublicPromptTabs } from "@/components/public-prompt/public-prompt-tabs";
import { PromptHeroCard } from "@/components/public-prompt/prompt-hero-card";

export function PublicPromptDetailPage({
  onBack,
  onAction,
}: {
  onBack: () => void;
  onAction: (label: string) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [forkOpen, setForkOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  if (loading) return <PublicPromptSkeleton />;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8"
      >
        <PublicPromptHeader
          saved={saved}
          bookmarked={bookmarked}
          liked={liked}
          onBack={onBack}
          onSave={() => {
            setSaved((value) => !value);
            onAction(saved ? "Removed from My Library" : "Saved to My Library");
          }}
          onBookmark={() => {
            setBookmarked((value) => !value);
            onAction(bookmarked ? "Bookmark removed" : "Prompt bookmarked");
          }}
          onLike={() => {
            setLiked((value) => !value);
            onAction(liked ? "Like removed" : "Prompt liked");
          }}
          onFork={() => setForkOpen(true)}
          onCopy={() => setCopyOpen(true)}
          onAction={onAction}
          onViewProfile={() => onAction("Author profile opened")}
        />

        <div className="mt-5"><PromptHeroCard /></div>

        <div className="mt-5 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] 2xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-5">
            <PublicPromptTabs onAction={onAction} />
            <CommentsSection onAction={onAction} />
          </main>
          <PublicPromptSidebar
            userRating={userRating}
            onRatingChange={(rating) => {
              setUserRating(rating);
              onAction(`${rating}-star rating submitted`);
            }}
            onAction={onAction}
          />
        </div>

        <footer className="mt-9 flex flex-col items-center justify-between gap-2 border-t border-white/[.06] py-5 text-[11px] text-slate-700 sm:flex-row">
          <p>© 2026 PromptHub Community.</p>
          <p>Spring Boot API Generator · MIT License · Public</p>
        </footer>
      </motion.div>

      <ForkPromptDialog open={forkOpen} onOpenChange={setForkOpen} onAction={onAction} />
      <CopyPublicPromptDialog open={copyOpen} onOpenChange={setCopyOpen} onAction={onAction} />
    </>
  );
}

function PublicPromptSkeleton() {
  return (
    <div className="mx-auto max-w-[1680px] animate-pulse px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <div className="h-4 w-64 rounded bg-white/[.04]" />
      <div className="mt-6 h-10 w-2/3 rounded bg-white/[.05]" />
      <div className="mt-3 h-3 w-1/2 rounded bg-white/[.035]" />
      <div className="mt-6 h-16 rounded-2xl border border-white/[.05] bg-[#161b22]" />
      <div className="mt-5 h-64 rounded-2xl border border-white/[.05] bg-[#161b22]" />
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="h-[620px] rounded-2xl border border-white/[.05] bg-[#161b22]" />
        <div className="space-y-4">
          <div className="h-52 rounded-2xl border border-white/[.05] bg-[#161b22]" />
          <div className="h-64 rounded-2xl border border-white/[.05] bg-[#161b22]" />
        </div>
      </div>
    </div>
  );
}
