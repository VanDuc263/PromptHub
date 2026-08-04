import { AlertCircle, MessageSquareText, Reply, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  addPromptCommentRequest,
  fetchPromptCommentsRequest,
  fetchPromptReviewsRequest,
  upsertPromptReviewRequest,
  type PromptCommentApi,
  type PromptReviewsApi,
} from "@/lib/prompt-feedback-api";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";

export function PromptFeedback({ promptId, onAction }: { promptId: string | null; onAction: (label: string) => void }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [comments, setComments] = useState<PromptCommentApi[]>([]);
  const [reviews, setReviews] = useState<PromptReviewsApi | null>(null);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<PromptCommentApi | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promptId) return;
    let active = true;
    Promise.all([
      fetchPromptCommentsRequest(promptId, accessToken),
      fetchPromptReviewsRequest(promptId, accessToken),
    ]).then(([commentItems, reviewData]) => {
      if (!active) return;
      setComments(commentItems);
      setReviews(reviewData);
      setRating(reviewData.currentUserReview?.rating ?? 0);
      setReviewContent(reviewData.currentUserReview?.content ?? "");
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Could not load comments and reviews.");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [accessToken, promptId]);

  if (!promptId) return null;

  const submitComment = async () => {
    const content = comment.trim();
    if (!accessToken || !content || submittingComment) return;
    setSubmittingComment(true);
    setError(null);
    try {
      const created = await addPromptCommentRequest(promptId, content, replyTo?.id ?? null, accessToken);
      setComments((items) => [...items, created]);
      setComment("");
      setReplyTo(null);
      onAction(replyTo ? "Reply posted" : "Comment posted");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not post comment.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const submitReview = async () => {
    if (!accessToken || rating < 1 || submittingReview) return;
    setSubmittingReview(true);
    setError(null);
    try {
      const result = await upsertPromptReviewRequest(promptId, rating, reviewContent.trim(), accessToken);
      setReviews(result);
      onAction(result.currentUserReview?.edited ? "Review updated" : "Review submitted");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]" aria-label="Prompt comments and reviews">
      <div className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
        <div className="flex items-center justify-between">
          <div><h2 className="text-sm font-semibold text-slate-100">Comments</h2><p className="mt-1 text-[10px] text-slate-600">Discuss this prompt with collaborators.</p></div>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500"><MessageSquareText className="size-3.5" /> {comments.length}</span>
        </div>

        <div className="mt-5 space-y-1">
          {loading && [0, 1].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg bg-white/[.025]" />)}
          {!loading && comments.length === 0 && <p className="rounded-lg border border-dashed border-white/[.08] px-4 py-8 text-center text-xs text-slate-600">No comments yet. Start the conversation.</p>}
          {comments.map((item) => (
            <article key={item.id} className={cn("flex gap-3 rounded-lg px-2 py-3 hover:bg-white/[.02]", item.parentId && "ml-8 border-l border-white/[.07]")}>
              <Avatar initials={initials(item.author)} className="size-8 text-[9px]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><strong className="text-xs font-medium text-slate-200">{item.author}</strong>{item.mine && <span className="text-[9px] text-violet-400">You</span>}<span className="text-[9px] text-slate-700">{relativeTime(item.createdAt)}{item.edited ? " · edited" : ""}</span></div>
                <p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-400">{item.content}</p>
                <button type="button" onClick={() => setReplyTo(item)} className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-violet-300"><Reply className="size-3" /> Reply</button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 border-t border-white/[.06] pt-4">
          {replyTo && <div className="mb-2 flex items-center justify-between rounded-md bg-violet-500/[.06] px-3 py-2 text-[10px] text-violet-300"><span>Replying to {replyTo.author}</span><button type="button" onClick={() => setReplyTo(null)}>Cancel</button></div>}
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={5000} rows={3} placeholder="Write a comment…" className="w-full resize-y rounded-lg border border-white/[.08] bg-[#0d1117] px-3 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
          <div className="mt-2 flex items-center justify-between gap-3">{!accessToken && <span className="text-[10px] text-amber-400/80">Sign in to join the discussion.</span>}<Button className="ml-auto" size="sm" disabled={!accessToken || !comment.trim() || submittingComment} onClick={() => void submitComment()}><Send className="size-3.5" /> {submittingComment ? "Posting…" : replyTo ? "Post reply" : "Comment"}</Button></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
          <div className="flex items-start justify-between gap-4"><div><h2 className="text-sm font-semibold text-slate-100">Rating & review</h2><p className="mt-1 text-[10px] text-slate-600">Share your experience with this prompt.</p></div><div className="text-right"><p className="text-xl font-semibold text-slate-100">{reviews?.averageRating.toFixed(1) ?? "—"}</p><p className="text-[9px] text-slate-600">{reviews?.reviewCount ?? 0} reviews</p></div></div>
          <div className="mt-5 flex gap-1" aria-label="Choose rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} className={cn("rounded p-1 outline-none focus-visible:ring-2 focus-visible:ring-violet-500", value <= rating ? "text-amber-400" : "text-slate-700 hover:text-amber-400/60")}><Star className="size-5" fill={value <= rating ? "currentColor" : "none"} /></button>)}</div>
          <textarea value={reviewContent} onChange={(event) => setReviewContent(event.target.value)} maxLength={2000} rows={3} placeholder="What worked well? What could improve?" className="mt-3 w-full resize-y rounded-lg border border-white/[.08] bg-[#0d1117] px-3 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-violet-500/50" />
          <Button className="mt-3 w-full" size="sm" disabled={!accessToken || rating < 1 || submittingReview} onClick={() => void submitReview()}>{!accessToken ? "Sign in to review" : submittingReview ? "Saving…" : reviews?.currentUserReview ? "Update review" : "Submit review"}</Button>
        </div>

        {reviews?.reviews.slice(0, 3).map((review) => <article key={review.id} className="rounded-xl border border-white/[.07] bg-[#161b22] p-4"><div className="flex items-center gap-2"><Avatar initials={initials(review.author)} className="size-7 text-[8px]" /><strong className="text-[11px] font-medium text-slate-300">{review.author}</strong><span className="ml-auto flex text-amber-400">{Array.from({ length: review.rating }, (_, index) => <Star key={index} className="size-3" fill="currentColor" />)}</span></div>{review.content && <p className="mt-3 text-[11px] leading-5 text-slate-500">{review.content}</p>}<p className="mt-2 text-[9px] text-slate-700">{relativeTime(review.updatedAt)}{review.edited ? " · edited" : ""}</p></article>)}
      </div>

      {error && <div role="alert" className="xl:col-span-2 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[.06] px-4 py-3 text-xs text-rose-300"><AlertCircle className="size-4" /> {error}</div>}
    </section>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? "U"}${parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""}`.toUpperCase();
}

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}
