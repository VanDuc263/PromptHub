import { Heart, MessageCircle, Send, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/prompt-editor/field";
import { publicComments } from "@/data/public-prompt-data";
import { cn } from "@/lib/utils";
import type { CommunityComment } from "@/types";

export function CommentsSection({
  onAction,
}: {
  onAction: (label: string) => void;
}) {
  const [comments, setComments] = useState<CommunityComment[]>(publicComments);
  const [sort, setSort] = useState("Newest");
  const [draft, setDraft] = useState("");

  const sortedComments = useMemo(() => {
    if (sort === "Top") return [...comments].sort((a, b) => b.likes - a.likes);
    if (sort === "Oldest") return [...comments].reverse();
    return comments;
  }, [comments, sort]);

  const submit = () => {
    if (!draft.trim()) return;
    setComments((items) => [
      {
        id: Date.now(),
        author: "Van Duc",
        initials: "VD",
        rating: 5,
        comment: draft.trim(),
        createdAt: "Just now",
        replies: 0,
        likes: 0,
        tone: "bg-violet-500/15 text-violet-300",
      },
      ...items,
    ]);
    setDraft("");
    onAction("Comment published");
  };

  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/[.07] bg-[#161b22]">
      <div className="flex items-center border-b border-white/[.07] px-5 py-4">
        <MessageCircle className="size-4 text-emerald-400" />
        <h2 className="ml-2 text-xs font-semibold text-slate-200">Community discussion</h2>
        <span className="ml-2 text-[9px] text-slate-700">{comments.length} comments</span>
        <div className="ml-auto w-24"><SelectField value={sort} onChange={(event) => setSort(event.target.value)} className="h-8 text-[10px]"><option>Newest</option><option>Top</option><option>Oldest</option></SelectField></div>
      </div>

      <div className="border-b border-white/[.07] p-5">
        <div className="flex gap-3">
          <Avatar initials="VD" className="size-8 text-[9px]" />
          <div className="min-w-0 flex-1">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              rows={3}
              placeholder="Share how this prompt worked for you..."
              className="w-full resize-none rounded-xl border border-white/[.08] bg-[#0d1117] px-3.5 py-3 text-xs leading-5 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10"
            />
            <div className="mt-2 flex items-center">
              <span className="text-[9px] text-slate-700">Markdown supported</span>
              <Button size="sm" className="ml-auto bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={submit} disabled={!draft.trim()}><Send className="size-3.5" /> Comment</Button>
            </div>
          </div>
        </div>
      </div>

      {sortedComments.length ? (
        <div className="divide-y divide-white/[.06]">
          {sortedComments.map((comment) => <CommentItem key={comment.id} comment={comment} onAction={onAction} />)}
        </div>
      ) : (
        <div className="py-14 text-center"><MessageCircle className="mx-auto size-6 text-slate-700" /><h3 className="mt-3 text-sm text-slate-400">No comments yet</h3><p className="mt-1 text-xs text-slate-700">Start the conversation with a useful observation.</p></div>
      )}
    </motion.section>
  );
}

function CommentItem({ comment, onAction }: { comment: CommunityComment; onAction: (label: string) => void }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="flex gap-3 p-5">
      <Avatar initials={comment.initials} className={cn("size-8 text-[9px]", comment.tone)} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] font-medium text-slate-300">{comment.author}</p>
          <span className="flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-2.5 ${index < comment.rating ? "fill-amber-400 text-amber-400" : "text-slate-800"}`} />)}</span>
          <span className="text-[9px] text-slate-700">{comment.createdAt}</span>
        </div>
        <p className="mt-2 text-xs leading-6 text-slate-500">{comment.comment}</p>
        <div className="mt-3 flex items-center gap-3 text-[9px] text-slate-700">
          <button type="button" onClick={() => setLiked((value) => !value)} className="inline-flex items-center gap-1 transition hover:text-rose-400"><Heart className={`size-3 ${liked ? "fill-rose-400 text-rose-400" : ""}`} /> {comment.likes + (liked ? 1 : 0)}</button>
          <button type="button" onClick={() => onAction(`Replying to ${comment.author}`)} className="inline-flex items-center gap-1 transition hover:text-slate-400"><MessageCircle className="size-3" /> {comment.replies} replies</button>
        </div>
      </div>
    </article>
  );
}
