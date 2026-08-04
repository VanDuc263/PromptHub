import { AlertCircle, MessageSquareText, Reply, Send, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { addPromptCommentRequest, fetchPromptCommentsRequest, fetchPromptReviewsRequest, upsertPromptReviewRequest, type PromptCommentApi, type PromptReviewApi, type PromptReviewsApi } from "@/lib/prompt-feedback-api";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store";

export function PromptComments({ promptId, onAction, readOnly = false }: { promptId: string; onAction?: (label: string) => void; readOnly?: boolean }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [comments, setComments] = useState<PromptCommentApi[]>([]);
  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<PromptCommentApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPromptCommentsRequest(promptId, accessToken).then((items) => active && setComments(items)).catch((reason: unknown) => active && setError(toMessage(reason, "Could not load comments."))).finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [accessToken, promptId]);

  const submit = async () => {
    const content = comment.trim();
    if (!accessToken || !content || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const created = await addPromptCommentRequest(promptId, content, replyTo?.id ?? null, accessToken);
      setComments((items) => [...items, created]);
      setComment("");
      setReplyTo(null);
      onAction?.(replyTo ? "Reply posted" : "Comment posted");
    } catch (reason) {
      setError(toMessage(reason, "Could not post comment."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-5" aria-label="Prompt comments">
      <div className="flex items-center justify-between"><div><h2 className="text-sm font-semibold text-slate-100">Comments</h2><p className="mt-1 text-[10px] text-slate-600">Discussion about this prompt.</p></div><span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500"><MessageSquareText className="size-3.5" /> {comments.length}</span></div>
      <div className="mt-5 space-y-1">
        {loading && [0, 1].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg bg-white/[.025]" />)}
        {!loading && comments.length === 0 && <Empty text="No comments yet." />}
        {comments.map((item) => <article key={item.id} className={cn("flex gap-3 rounded-lg px-2 py-3 hover:bg-white/[.02]", item.parentId && "ml-8 border-l border-white/[.07]")}><Avatar initials={initials(item.author)} className="size-8 text-[9px]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs font-medium text-slate-200">{item.author}</strong>{item.mine && <span className="text-[9px] text-violet-400">You</span>}<span className="text-[9px] text-slate-700">{relativeTime(item.createdAt)}{item.edited ? " · edited" : ""}</span></div><p className="mt-1.5 whitespace-pre-wrap text-xs leading-5 text-slate-400">{item.content}</p>{!readOnly && accessToken && <button type="button" onClick={() => setReplyTo(item)} className="mt-2 inline-flex items-center gap-1 text-[10px] text-slate-600 hover:text-violet-300"><Reply className="size-3" /> Reply</button>}</div></article>)}
      </div>
      {!readOnly && <div className="mt-4 border-t border-white/[.06] pt-4">{replyTo && <div className="mb-2 flex items-center justify-between rounded-md bg-violet-500/[.06] px-3 py-2 text-[10px] text-violet-300"><span>Replying to {replyTo.author}</span><button type="button" onClick={() => setReplyTo(null)}>Cancel</button></div>}{accessToken ? <><textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength={5000} rows={3} placeholder="Write a comment…" className="w-full resize-y rounded-lg border border-white/[.08] bg-[#0d1117] px-3 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-700 focus:border-violet-500/50" /><div className="mt-2 flex justify-end"><Button size="sm" disabled={!comment.trim() || submitting} onClick={() => void submit()}><Send className="size-3.5" /> {submitting ? "Posting…" : replyTo ? "Post reply" : "Comment"}</Button></div></> : <p className="text-xs text-amber-400/80">Sign in to join the discussion.</p>}</div>}
      {error && <FeedbackError text={error} />}
    </section>
  );
}

export function PromptReviews({ promptId, embedded = false }: { promptId: string; embedded?: boolean }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [data, setData] = useState<PromptReviewsApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; fetchPromptReviewsRequest(promptId, accessToken).then((result) => active && setData(result)).catch((reason: unknown) => active && setError(toMessage(reason, "Could not load reviews."))); return () => { active = false; }; }, [accessToken, promptId]);
  return (
    <section className={embedded ? "p-5" : "rounded-xl border border-white/[.07] bg-[#161b22] p-5"} aria-label="All prompt reviews">
      <div className="flex items-end justify-between gap-4 border-b border-white/[.06] pb-4"><div><h2 className="text-sm font-semibold text-slate-100">Reviews</h2><p className="mt-1 text-[10px] text-slate-600">Ratings and feedback from the community.</p></div><div className="text-right"><p className="text-2xl font-semibold text-slate-100">{data?.averageRating.toFixed(1) ?? "—"}</p><p className="text-[9px] text-slate-600">{data?.reviewCount ?? 0} reviews</p></div></div>
      <div className="mt-3 divide-y divide-white/[.06]">{!data && !error && [0, 1].map((item) => <div key={item} className="h-24 animate-pulse bg-white/[.015]" />)}{data?.reviews.length === 0 && <Empty text="No reviews yet." />}{data?.reviews.map((review) => <ReviewItem key={review.id} review={review} />)}</div>
      {error && <FeedbackError text={error} />}
    </section>
  );
}

export function PersonalPromptReview({ promptId, onAction }: { promptId: string; onAction: (label: string) => void }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [data, setData] = useState<PromptReviewsApi | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let active = true; fetchPromptReviewsRequest(promptId, accessToken).then((result) => { if (!active) return; setData(result); setRating(result.currentUserReview?.rating ?? 0); setContent(result.currentUserReview?.content ?? ""); }).catch((reason: unknown) => active && setError(toMessage(reason, "Could not load your review."))); return () => { active = false; }; }, [accessToken, promptId]);
  const submit = async () => { if (!accessToken || rating < 1 || submitting) return; setSubmitting(true); setError(null); try { const result = await upsertPromptReviewRequest(promptId, rating, content.trim(), accessToken); setData(result); setRating(result.currentUserReview?.rating ?? rating); setContent(result.currentUserReview?.content ?? ""); onAction(result.currentUserReview?.edited ? "Review updated" : "Review submitted"); } catch (reason) { setError(toMessage(reason, "Could not submit review.")); } finally { setSubmitting(false); } };
  return (
    <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4" aria-label="Your review">
      <div className="flex items-end justify-between"><div><h2 className="text-[10px] font-semibold uppercase tracking-[.13em] text-slate-600">Your review</h2><p className="mt-2 text-[10px] text-slate-500">Rate your experience</p></div><div className="text-right"><p className="text-xl font-semibold text-slate-100">{data?.averageRating.toFixed(1) ?? "—"}</p><p className="text-[8px] text-slate-700">{data?.reviewCount ?? 0} total</p></div></div>
      {accessToken ? <><div className="mt-3 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} stars`} className={value <= rating ? "text-amber-400" : "text-slate-700 hover:text-amber-400/60"}><Star className="size-5" fill={value <= rating ? "currentColor" : "none"} /></button>)}</div><textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={2000} rows={3} placeholder="Optional review…" className="mt-3 w-full resize-y rounded-lg border border-white/[.08] bg-[#0d1117] px-3 py-2.5 text-[11px] text-slate-200 outline-none placeholder:text-slate-700 focus:border-emerald-500/40" /><Button className="mt-3 w-full bg-emerald-500 text-[#07120b] hover:bg-emerald-400" size="sm" disabled={rating < 1 || submitting} onClick={() => void submit()}>{submitting ? "Saving…" : data?.currentUserReview ? "Update review" : "Submit review"}</Button></> : <p className="mt-4 text-[10px] text-amber-400/80">Sign in to rate this prompt.</p>}
      {error && <FeedbackError text={error} />}
    </section>
  );
}

function ReviewItem({ review }: { review: PromptReviewApi }) { return <article className="flex gap-3 py-4"><Avatar initials={initials(review.author)} className="size-8 text-[9px]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><strong className="text-xs font-medium text-slate-300">{review.author}</strong>{review.mine && <span className="text-[9px] text-violet-400">You</span>}<span className="flex text-amber-400">{Array.from({ length: review.rating }, (_, index) => <Star key={index} className="size-3" fill="currentColor" />)}</span><span className="text-[9px] text-slate-700">{relativeTime(review.updatedAt)}{review.edited ? " · edited" : ""}</span></div>{review.content && <p className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-500">{review.content}</p>}</div></article>; }
function Empty({ text }: { text: string }) { return <p className="rounded-lg border border-dashed border-white/[.08] px-4 py-8 text-center text-xs text-slate-600">{text}</p>; }
function FeedbackError({ text }: { text: string }) { return <div role="alert" className="mt-4 flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/[.06] px-3 py-2 text-[10px] text-rose-300"><AlertCircle className="size-3.5" /> {text}</div>; }
function toMessage(reason: unknown, fallback: string) { return reason instanceof Error ? reason.message : fallback; }
function initials(name: string) { const parts = name.trim().split(/\s+/); return `${parts[0]?.[0] ?? "U"}${parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""}`.toUpperCase(); }
function relativeTime(value: string) { const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000)); if (minutes < 1) return "Just now"; if (minutes < 60) return `${minutes}m ago`; const hours = Math.floor(minutes / 60); if (hours < 24) return `${hours}h ago`; const days = Math.floor(hours / 24); return days < 30 ? `${days}d ago` : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)); }
