import { Bot, CalendarClock, Globe2, LockKeyhole, Tag } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { promptDetail } from "@/data/prompt-detail-data";

export function PromptSummary() {
  return (
    <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-5 sm:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-violet-400">Prompt details</p>
      <h2 className="mt-3 text-xl font-semibold tracking-[-.025em] text-slate-100">{promptDetail.title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">{promptDetail.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[.06] pt-5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-2">
          <Avatar initials={promptDetail.authorInitials} className="size-7 text-[9px]" />
          <span>by <strong className="font-medium text-slate-300">{promptDetail.author}</strong></span>
        </span>
        <span className="inline-flex items-center gap-1.5"><Tag className="size-3.5" /> {promptDetail.category}</span>
        <span className="inline-flex items-center gap-1.5"><Bot className="size-3.5" /> {promptDetail.model}</span>
        <span className="inline-flex items-center gap-1.5"><Globe2 className="size-3.5" /> {promptDetail.language}</span>
        <span className="inline-flex items-center gap-1.5"><LockKeyhole className="size-3.5" /> {promptDetail.visibility}</span>
        <span className="inline-flex items-center gap-1.5"><CalendarClock className="size-3.5" /> {promptDetail.updatedAt}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {promptDetail.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
      </div>
    </section>
  );
}
