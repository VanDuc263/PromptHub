import {
  Activity,
  ArrowRight,
  Boxes,
  FileCode2,
  Grid2X2,
  Info,
  List,
  MessageSquareQuote,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/prompt-editor/field";
import {
  AchievementGrid,
  ActivityTimeline,
  CollectionCard,
  CreatorPromptCard,
  ProfileEmpty,
} from "@/components/profile/profile-cards";
import { ProfileSidebar } from "@/components/profile/profile-sidebar";
import {
  creatorProfile,
  profileAchievements,
  profileActivities,
  profileCollections,
  profilePrompts,
  profileReviews,
} from "@/data/profile-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview", icon: UserRound },
  { id: "prompts", label: "Prompts", count: 48, icon: FileCode2 },
  { id: "collections", label: "Collections", count: 12, icon: Boxes },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "reviews", label: "Reviews", count: 126, icon: MessageSquareQuote },
  { id: "about", label: "About", icon: Info },
] as const;

type ProfileTab = (typeof tabs)[number]["id"];

export function ProfileTabs({
  isOwner,
  onEdit,
  onAction,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onAction: (label: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("overview");

  return (
    <section>
      <div className="sticky top-[72px] z-20 overflow-x-auto border-b border-white/[.07] bg-[#0d1117]/90 backdrop-blur-xl">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative inline-flex h-12 items-center gap-2 px-3 text-[11px] font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/60",
                  activeTab === tab.id ? "text-violet-300" : "text-slate-600 hover:text-slate-300",
                )}
              >
                <Icon className="size-3.5" /> {tab.label}
                {"count" in tab && tab.count && <span className="rounded bg-white/[.04] px-1.5 py-0.5 text-[8px] text-slate-700">{tab.count}</span>}
                {activeTab === tab.id && <motion.span layoutId="profile-tab" className="absolute inset-x-2 bottom-0 h-0.5 rounded-t bg-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="mt-6">
          {activeTab === "overview" && <OverviewTab isOwner={isOwner} onEdit={onEdit} onAction={onAction} onViewAll={(tab) => setActiveTab(tab)} />}
          {activeTab === "prompts" && <PromptsTab onAction={onAction} />}
          {activeTab === "collections" && <CollectionsTab onAction={onAction} />}
          {activeTab === "activity" && <ActivityTab onAction={onAction} />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "about" && <AboutTab />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function OverviewTab({
  isOwner,
  onEdit,
  onAction,
  onViewAll,
}: {
  isOwner: boolean;
  onEdit: () => void;
  onAction: (label: string) => void;
  onViewAll: (tab: ProfileTab) => void;
}) {
  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
      <main className="min-w-0 space-y-9">
        <section>
          <SectionHeading title="Featured Prompts" subtitle="A selection of the creator’s most useful public prompts." action="View all prompts" onAction={() => onViewAll("prompts")} />
          <div className="grid gap-3 2xl:grid-cols-3">{profilePrompts.filter((prompt) => prompt.featured).map((prompt) => <CreatorPromptCard key={prompt.id} prompt={prompt} onAction={onAction} />)}</div>
        </section>
        <section>
          <SectionHeading title="Popular Collections" subtitle="Curated prompt sets for practical developer workflows." action="View all collections" onAction={() => onViewAll("collections")} />
          <div className="grid gap-3 md:grid-cols-2">{profileCollections.map((collection) => <CollectionCard key={collection.id} collection={collection} onAction={onAction} />)}</div>
        </section>
        <section>
          <SectionHeading title="Recent Activity" subtitle="Latest public contributions and milestones." action="View full activity" onAction={() => onViewAll("activity")} />
          <ActivityTimeline activities={profileActivities} limit={5} onAction={onAction} />
        </section>
        <section>
          <SectionHeading title="Creator Achievements" subtitle="Recognition earned through quality and community contribution." />
          <AchievementGrid achievements={profileAchievements} />
        </section>
      </main>
      <ProfileSidebar isOwner={isOwner} onEdit={onEdit} onAction={onAction} />
    </div>
  );
}

function PromptsTab({ onAction }: { onAction: (label: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [model, setModel] = useState("All models");
  const [sort, setSort] = useState("Most Popular");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(4);

  const prompts = useMemo(() => {
    const filtered = profilePrompts.filter((prompt) =>
      (!query || `${prompt.title} ${prompt.description} ${prompt.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())) &&
      (category === "All categories" || prompt.category === category) &&
      (model === "All models" || prompt.models.includes(model)),
    );
    return [...filtered].sort((a, b) => sort === "Most Copied" ? b.copies - a.copies : sort === "Highest Rated" ? b.rating - a.rating : sort === "Oldest" ? a.id - b.id : b.copies + b.likes - a.copies - a.likes);
  }, [category, model, query, sort]);

  return (
    <div>
      <SectionHeading title="Public Prompts" subtitle="All prompts published by Đức Nguyễn." />
      <div className="mb-5 flex flex-col gap-2 rounded-2xl border border-white/[.07] bg-[#161b22] p-3 lg:flex-row">
        <div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => { setQuery(event.target.value); setVisible(4); }} placeholder="Search prompts..." className="h-9 w-full rounded-lg border border-white/[.07] bg-[#0d1117] pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-violet-500/40" /></div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <SelectField value={category} onChange={(event) => setCategory(event.target.value)} className="h-9"><option>All categories</option><option>Programming</option><option>Code Review</option><option>Education</option></SelectField>
          <SelectField value={model} onChange={(event) => setModel(event.target.value)} className="h-9"><option>All models</option>{creatorProfile.preferredModels.map((item) => <option key={item}>{item}</option>)}</SelectField>
          <SelectField value={sort} onChange={(event) => setSort(event.target.value)} className="h-9"><option>Most Popular</option><option>Most Copied</option><option>Highest Rated</option><option>Recently Updated</option><option>Oldest</option></SelectField>
        </div>
        <div className="flex rounded-lg border border-white/[.07] bg-[#0d1117] p-1"><button type="button" onClick={() => setLayout("grid")} aria-label="Grid view" className={cn("grid size-7 place-items-center rounded-md", layout === "grid" ? "bg-white/[.06] text-slate-300" : "text-slate-700")}><Grid2X2 className="size-3.5" /></button><button type="button" onClick={() => setLayout("list")} aria-label="List view" className={cn("grid size-7 place-items-center rounded-md", layout === "list" ? "bg-white/[.06] text-slate-300" : "text-slate-700")}><List className="size-3.5" /></button></div>
      </div>
      {prompts.length ? (
        <>
          <div className={cn("grid gap-3", layout === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1")}>{prompts.slice(0, visible).map((prompt) => <CreatorPromptCard key={prompt.id} prompt={prompt} layout={layout} onAction={onAction} />)}</div>
          {visible < prompts.length && <div className="mt-5 text-center"><Button variant="secondary" onClick={() => setVisible((value) => value + 3)}>Load more prompts</Button></div>}
        </>
      ) : <ProfileEmpty title="No public prompts yet" subtitle="This creator has not published any prompts matching your filters." />}
    </div>
  );
}

function CollectionsTab({ onAction }: { onAction: (label: string) => void }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Most Followed");
  const collections = profileCollections.filter((collection) => `${collection.name} ${collection.description} ${collection.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === "Newest" ? a.id - b.id : b.followers - a.followers);
  return (
    <div>
      <SectionHeading title="Public Collections" subtitle="Curated prompt collections shared with the community." />
      <div className="mb-5 flex gap-2 rounded-2xl border border-white/[.07] bg-[#161b22] p-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections..." className="h-9 w-full rounded-lg border border-white/[.07] bg-[#0d1117] pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-violet-500/40" /></div>
        <div className="w-36"><SelectField value={sort} onChange={(event) => setSort(event.target.value)} className="h-9"><option>Most Followed</option><option>Newest</option><option>Recently Updated</option></SelectField></div>
      </div>
      {collections.length ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{collections.map((collection) => <CollectionCard key={collection.id} collection={collection} onAction={onAction} />)}</div> : <ProfileEmpty title="No collections yet" subtitle="This creator has not shared any public collections." />}
    </div>
  );
}

function ActivityTab({ onAction }: { onAction: (label: string) => void }) {
  const [filter, setFilter] = useState("All Activity");
  const activities = filter === "All Activity" ? profileActivities : profileActivities.filter((item) => item.type === filter);
  const groups = ["Today", "Yesterday", "This Week", "Earlier"] as const;
  return (
    <div>
      <SectionHeading title="Contribution Activity" subtitle="A complete timeline of public contributions." />
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl border border-white/[.07] bg-[#161b22] p-2">
        {["All Activity", "Prompts", "Collections", "Reviews", "Followers"].map((item) => <button type="button" key={item} onClick={() => setFilter(item)} className={cn("h-8 shrink-0 rounded-lg px-3 text-[10px] transition", filter === item ? "bg-violet-500/10 text-violet-300" : "text-slate-600 hover:text-slate-300")}>{item}</button>)}
      </div>
      {activities.length ? <div className="space-y-6">{groups.map((group) => { const items = activities.filter((item) => item.group === group); return items.length ? <section key={group}><h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[.13em] text-slate-700">{group}</h3><ActivityTimeline activities={items} onAction={onAction} /></section> : null; })}</div> : <ProfileEmpty title="No activity" subtitle="No public activity matches this filter." />}
    </div>
  );
}

function ReviewsTab() {
  const [sort, setSort] = useState("Most Helpful");
  const reviews = [...profileReviews].sort((a, b) => sort === "Newest" ? b.id - a.id : sort === "Highest Rating" ? b.rating - a.rating : sort === "Lowest Rating" ? a.rating - b.rating : b.helpful - a.helpful);
  return (
    <div>
      <SectionHeading title="Creator Reviews" subtitle="Feedback received across all public prompts." />
      <div className="mb-5 grid gap-3 md:grid-cols-[220px_1fr_220px]">
        <div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5 text-center"><p className="text-4xl font-semibold text-slate-100">4.8</p><div className="mt-2 flex justify-center gap-0.5">{[1,2,3,4,5].map((i) => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}</div><p className="mt-2 text-[9px] text-slate-700">126 total reviews</p></div>
        <div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5">{[5,4,3,2,1].map((stars) => <div key={stars} className="mb-2 flex items-center gap-2 last:mb-0"><span className="w-2 text-[8px] text-slate-600">{stars}</span><Star className="size-2.5 fill-amber-400 text-amber-400" /><div className="h-1 flex-1 rounded bg-white/[.05]"><div className={cn("h-full rounded bg-amber-400/70", stars === 5 ? "w-4/5" : stars === 4 ? "w-1/4" : "w-[6%]")} /></div></div>)}</div>
        <div className="rounded-2xl border border-violet-500/12 bg-violet-500/[.035] p-5"><p className="text-[9px] uppercase tracking-[.12em] text-slate-700">Most reviewed</p><p className="mt-3 text-xs font-medium leading-5 text-slate-300">Spring Boot REST API Generator</p><p className="mt-2 text-[9px] text-violet-300">48 reviews</p></div>
      </div>
      <div className="mb-3 ml-auto w-40"><SelectField value={sort} onChange={(event) => setSort(event.target.value)} className="h-9"><option>Most Helpful</option><option>Newest</option><option>Highest Rating</option><option>Lowest Rating</option></SelectField></div>
      {reviews.length ? <div className="space-y-3">{reviews.map((review) => <ReviewCard key={review.id} review={review} />)}</div> : <ProfileEmpty title="No reviews yet" subtitle="This creator has not received any public reviews." />}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof profileReviews)[number] }) {
  const [helpful, setHelpful] = useState(false);
  return (
    <article className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5">
      <div className="flex items-center"><Avatar initials={review.initials} className={cn("size-8 text-[9px]", review.tone)} /><div className="ml-3"><p className="text-[11px] font-medium text-slate-300">{review.reviewer}</p><div className="mt-1 flex gap-0.5">{[1,2,3,4,5].map((i) => <Star key={i} className={cn("size-2.5", i <= review.rating ? "fill-amber-400 text-amber-400" : "text-slate-800")} />)}</div></div><span className="ml-auto text-[9px] text-slate-700">{review.date}</span></div>
      <p className="mt-3 text-[10px] text-violet-300">{review.prompt}</p><p className="mt-2 text-xs leading-6 text-slate-500">{review.text}</p>
      {review.reply && <div className="mt-4 rounded-xl border-l-2 border-violet-500/40 bg-violet-500/[.035] p-3"><p className="text-[9px] font-medium text-violet-300">Creator reply</p><p className="mt-1.5 text-[10px] leading-5 text-slate-500">{review.reply}</p></div>}
      <button type="button" onClick={() => setHelpful((value) => !value)} className={cn("mt-3 text-[9px] transition", helpful ? "text-emerald-400" : "text-slate-700 hover:text-slate-400")}>Helpful · {review.helpful + (helpful ? 1 : 0)}</button>
    </article>
  );
}

function AboutTab() {
  const sections = [
    ["About Me", "I focus on creating reusable prompts for Java backend developers. My prompts prioritize clear requirements, predictable outputs, production-ready architecture, and practical implementation details."],
    ["Skills and Expertise", creatorProfile.skills.join(" · ")],
    ["Preferred AI Models", creatorProfile.preferredModels.join(" · ")],
    ["Prompt Creation Philosophy", "Every prompt should make assumptions visible, constrain failure modes, and produce output that a working engineer can evaluate quickly. I favor explicit structure over clever wording."],
    ["Public Links", `${creatorProfile.website} · ${creatorProfile.github} · ${creatorProfile.linkedin}`],
    ["Contribution Statistics", "48 public prompts, 12 curated collections, 24,800 prompt copies, 486 forks, and 126 community reviews."],
  ];
  return <div><SectionHeading title="About Đức" subtitle="Background, expertise, and contribution principles." /><div className="grid gap-3 md:grid-cols-2">{sections.map(([title, content]) => <article key={title} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><h3 className="text-xs font-semibold text-slate-300">{title}</h3><p className="mt-3 text-xs leading-6 text-slate-500">{content}</p></article>)}</div></div>;
}

function SectionHeading({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) {
  return <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-100">{title}</h2><p className="mt-1 text-[10px] text-slate-600">{subtitle}</p></div>{action && <button type="button" onClick={onAction} className="group inline-flex items-center gap-1.5 text-[10px] text-slate-600 transition hover:text-violet-300">{action}<ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></button>}</div>;
}
