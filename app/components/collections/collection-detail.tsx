import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Archive,
  Bell,
  Bookmark,
  ChevronRight,
  Copy,
  Download,
  Edit3,
  Eye,
  FileCode2,
  FolderPlus,
  GitFork,
  Globe2,
  Grid2X2,
  List,
  LockKeyhole,
  MoreHorizontal,
  Search,
  Share2,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { AddPromptsDialog } from "@/components/collections/collection-dialogs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { savedPromptCatalog } from "@/data/saved-data";
import { useCollections } from "@/hooks/use-collections";
import { useSavedPrompts } from "@/hooks/use-saved-prompts";
import { cn, formatCompact } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchExplorePrompts } from "@/store/explore-slice";
import { fetchMyPrompts } from "@/store/my-prompts-slice";
import { fetchSavedPrompts } from "@/store/saved-prompts-slice";
import type { PromptCollection, SavedPrompt } from "@/types";

const tabs = ["Overview", "Prompts", "Activity", "Members", "Settings"];
const models = ["GPT-5", "Claude", "Gemini", "DeepSeek"];
const groupedActivity = [
  { group: "Today", action: "Added “Senior Java Reviewer”", detail: "Van Duc added a production code-review prompt.", time: "2 hours ago" },
  { group: "Today", action: "Updated Spring Boot Generator", detail: "Prompt compatibility now includes GPT-5.", time: "5 hours ago" },
  { group: "Yesterday", action: "Removed SQL Optimizer", detail: "The original prompt remains available in My Prompts.", time: "Yesterday" },
  { group: "This Week", action: "Collection made public", detail: "Visibility was changed by the owner.", time: "4 days ago" },
  { group: "This Week", action: "New follower", detail: "Minh Trần followed this collection.", time: "5 days ago" },
  { group: "Earlier", action: "Forked by another user", detail: "A private copy was created by An Phạm.", time: "June 18" },
];

export function CollectionDetail({
  collection,
  onBack,
  onEdit,
  onShare,
  onDuplicate,
  onDelete,
  onAction,
}: {
  collection: PromptCollection;
  onBack: () => void;
  onEdit: () => void;
  onShare: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onAction: (label: string) => void;
}) {
  const coverImage = collection.localCoverImageUrl ?? collection.coverImageUrl;
  const { removePrompt, toggleFollow, updateCollection } = useCollections();
  const dispatch = useAppDispatch();
  const myPromptsState = useAppSelector((state) => state.myPrompts);
  const savedPromptsState = useAppSelector((state) => state.savedPrompts);
  const exploreState = useAppSelector((state) => state.explore);
  const [tab, setTab] = useState("Overview");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const promptCatalog = useMemo(() => {
    const catalog = new Map<string, SavedPrompt>(savedPromptCatalog.map((prompt) => [prompt.id, prompt]));
    exploreState.prompts.forEach((prompt, index) => catalog.set(prompt.id, {
      id: prompt.id, title: prompt.title, description: prompt.description, author: prompt.author,
      authorInitials: prompt.authorInitials, category: prompt.category, tags: prompt.tags, models: prompt.models,
      version: "v1", rating: prompt.rating, copies: prompt.copies, forks: 0,
      updatedAt: prompt.publishedAt ?? "Recently", savedAt: "", savedOrder: 2_000 + index,
      visibility: "Public", language: "English", icon: FileCode2, accent: "bg-sky-500/10 text-sky-300",
    }));
    savedPromptsState.prompts.forEach((prompt, index) => catalog.set(prompt.id, {
      ...prompt, savedOrder: 1_000 + index, icon: FileCode2, accent: "bg-violet-500/10 text-violet-300",
    }));
    myPromptsState.prompts.forEach((prompt, index) => catalog.set(prompt.id, {
      id: prompt.id, title: prompt.title, description: prompt.description, author: prompt.author,
      authorInitials: prompt.author.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      category: prompt.category, tags: prompt.tags, models: [], version: prompt.version, rating: 0,
      copies: prompt.uses, forks: 0, updatedAt: prompt.updatedAt, savedAt: "", savedOrder: index,
      visibility: prompt.visibility === "Public" ? "Public" : "Private", language: "English",
      icon: FileCode2, accent: "bg-emerald-500/10 text-emerald-300",
    }));
    return catalog;
  }, [exploreState.prompts, myPromptsState.prompts, savedPromptsState.prompts]);
  const allPrompts = useMemo(() => collection.promptIds.flatMap((id) => {
    const prompt = promptCatalog.get(id);
    return prompt ? [prompt] : [];
  }), [collection.promptIds, promptCatalog]);
  const totalCopies = useMemo(() => allPrompts.reduce((total, prompt) => total + prompt.copies, 0), [allPrompts]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 450);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (myPromptsState.status === "idle") void dispatch(fetchMyPrompts());
    if (savedPromptsState.status === "idle") void dispatch(fetchSavedPrompts());
    if (exploreState.status === "idle") void dispatch(fetchExplorePrompts());
  }, [dispatch, exploreState.status, myPromptsState.status, savedPromptsState.status]);

  if (loading) return <DetailSkeleton />;

  const reorderPrompt = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const ids = [...collection.promptIds];
    const from = ids.indexOf(draggedId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    updateCollection(collection.id, { promptIds: ids });
    setDraggedId(null);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] text-slate-700">
          <button type="button" onClick={onBack} className="transition hover:text-violet-300">Collections</button>
          <ChevronRight className="size-3" />
          <span className="truncate text-slate-500">{collection.name}</span>
        </nav>

        <section className="mt-4 overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]">
          <div className="relative h-36 bg-gradient-to-br from-violet-500/25 via-fuchsia-500/[.07] to-transparent">
            {coverImage && <img src={coverImage} alt="" className="absolute inset-0 size-full object-cover" />}
            {coverImage && <div className="absolute inset-0 bg-gradient-to-t from-[#161b22]/70 via-transparent to-black/10" />}
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(167,139,250,.55)_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          <div className="p-5 sm:p-6">
            <div className="-mt-14 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="relative min-w-0">
                <div className="grid size-20 place-items-center rounded-2xl border-4 border-[#161b22] bg-[#0d1117] text-violet-300 shadow-xl"><FolderPlus className="size-8" /></div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{collection.name}</h1>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">{collection.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={onEdit}><Edit3 className="size-4" /> Edit Collection</Button>
                <Button variant="secondary" onClick={onShare}><Share2 className="size-4" /> Share</Button>
                <Button variant="secondary" onClick={onDuplicate}><Copy className="size-4" /> Duplicate</Button>
                <Button variant="secondary" onClick={() => toggleFollow(collection.id)}><Bell className={cn("size-4", collection.following && "fill-violet-400 text-violet-400")} />{collection.following ? "Following" : "Follow"}</Button>
                <MoreMenu onExport={() => onAction("Collection exported")} onArchive={() => onAction("Collection archived")} onDelete={onDelete} />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-600">
              <span className="inline-flex items-center gap-2"><Avatar initials={collection.ownerInitials} className="size-7 text-[8px]" /><strong className="font-medium text-slate-300">{collection.owner}</strong></span>
              <VisibilityBadge visibility={collection.visibility} />
              <span>{collection.promptIds.length} prompts</span><span>{formatCompact(collection.followers)} followers</span><span>Created {collection.createdAt}</span><span>Updated {collection.updatedAt.toLowerCase()}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">{collection.tags.map((tag) => <Badge key={tag} className="border-violet-500/15 bg-violet-500/[.05] text-violet-300">{tag}</Badge>)}</div>
          </div>
        </section>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[["Prompts", String(collection.promptIds.length), FolderPlus], ["Followers", formatCompact(collection.followers), Users], ["Views", formatCompact(collection.views), Eye], ["Copies", formatCompact(totalCopies), Copy]].map(([label, value, Icon]) => (
            <div key={label as string} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-slate-600">{label as string}</p><Icon className="size-4 text-violet-400" /></div><p className="mt-3 text-2xl font-semibold text-slate-100">{value as string}</p></div>
          ))}
        </div>

        <div className="sticky top-[72px] z-20 mt-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[.07] bg-[#0d1117]/95 p-1.5 backdrop-blur-xl">
          {tabs.filter((item) => item !== "Members" || collection.visibility === "Team").map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={cn("shrink-0 rounded-lg px-4 py-2 text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500/60", tab === item ? "bg-violet-500/10 text-violet-300" : "text-slate-600 hover:text-slate-300")}>{item}</button>)}
        </div>

        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]">
          <main className="min-w-0">
            {tab === "Overview" && <Overview description={collection.description} prompts={allPrompts} onAction={onAction} />}
            {tab === "Prompts" && <PromptsTab prompts={allPrompts} owner onRemove={(id) => removePrompt(collection.id, id)} onAction={onAction} onDragStart={setDraggedId} onDrop={reorderPrompt} />}
            {tab === "Activity" && <ActivityTab />}
            {tab === "Members" && <MembersTab />}
            {tab === "Settings" && <SettingsTab collection={collection} onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} onAction={onAction} />}
          </main>
          <DetailSidebar collection={collection} onShare={onShare} onDuplicate={onDuplicate} onAction={onAction} />
        </motion.div>
      </motion.div>

      <Button className="fixed bottom-6 right-6 z-30 bg-emerald-500 text-[#07120b] shadow-[0_14px_40px_rgba(34,197,94,.22)] hover:bg-emerald-400 lg:bottom-8 lg:right-8" onClick={() => setAddOpen(true)}><FolderPlus className="size-4" /> Add Prompt</Button>
      <div className="fixed inset-x-0 bottom-0 z-20 flex gap-2 border-t border-white/[.08] bg-[#0d1117]/95 p-3 backdrop-blur-xl lg:hidden"><Button variant="secondary" className="flex-1" onClick={onShare}><Share2 className="size-4" /> Share</Button><Button className="flex-1 bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => setAddOpen(true)}><FolderPlus className="size-4" /> Add Prompt</Button></div>
      <AddPromptsDialog open={addOpen} onOpenChange={setAddOpen} collectionId={collection.id} onDone={(count) => onAction(`${count} prompt${count === 1 ? "" : "s"} added to collection`)} />
    </>
  );
}

function MoreMenu({ onExport, onArchive, onDelete }: { onExport: () => void; onArchive: () => void; onDelete: () => void }) {
  return <DropdownMenu.Root><DropdownMenu.Trigger asChild><Button variant="icon" size="icon" aria-label="More collection actions"><MoreHorizontal className="size-4" /></Button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content align="end" className="dropdown-content w-44 p-1.5"><DropdownMenu.Item className="dropdown-item" onSelect={onExport}><Download /> Export Collection</DropdownMenu.Item><DropdownMenu.Item className="dropdown-item" onSelect={onArchive}><Archive /> Archive</DropdownMenu.Item><DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" /><DropdownMenu.Item className="dropdown-item text-rose-400" onSelect={onDelete}><Trash2 /> Delete</DropdownMenu.Item></DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>;
}

function VisibilityBadge({ visibility }: { visibility: PromptCollection["visibility"] }) {
  const Icon = visibility === "Private" ? LockKeyhole : visibility === "Public" ? Globe2 : Users;
  return <Badge><Icon className="mr-1 size-3" />{visibility}</Badge>;
}

function Overview({ description, prompts, onAction }: { description: string; prompts: SavedPrompt[]; onAction: (label: string) => void }) {
  return <div className="space-y-6">
    <Panel title="Collection description"><p className="text-sm leading-7 text-slate-500">{description}</p></Panel>
    <PromptSection title="Pinned prompts" subtitle="The essential starting points for this toolkit." prompts={prompts.slice(0, 2)} onAction={onAction} featured />
    <PromptSection title="Newest prompts" subtitle="Recently added workflows." prompts={prompts.slice().reverse().slice(0, 3)} onAction={onAction} />
    <PromptSection title="Popular prompts" subtitle="Most-used prompts across the community." prompts={prompts.slice(0, 3)} onAction={onAction} />
    <Panel title="Collection categories"><div className="flex flex-wrap gap-2">{["API Design", "Code Review", "Architecture", "Testing", "Performance", "Security"].map((item) => <Badge key={item}>{item}</Badge>)}</div></Panel>
    <Panel title="Learning resources"><div className="grid gap-2 sm:grid-cols-2">{["Spring Boot production checklist", "REST API design guide", "Microservice boundary worksheet", "Java code review rubric"].map((item) => <button type="button" key={item} className="rounded-xl border border-white/[.07] bg-[#0d1117] p-3 text-left text-xs text-slate-500 transition hover:border-violet-500/25 hover:text-violet-300">{item}</button>)}</div></Panel>
  </div>;
}

function PromptSection({ title, subtitle, prompts, onAction, featured = false }: { title: string; subtitle: string; prompts: SavedPrompt[]; onAction: (label: string) => void; featured?: boolean }) {
  return <section><div className="mb-3"><h2 className="text-sm font-semibold text-slate-300">{title}</h2><p className="mt-1 text-[10px] text-slate-700">{subtitle}</p></div>{prompts.length ? <div className={cn("grid gap-3", featured ? "lg:grid-cols-2" : "md:grid-cols-2 2xl:grid-cols-3")}>{prompts.map((prompt) => <CollectionPromptCard key={prompt.id} prompt={prompt} onAction={onAction} featured={featured} />)}</div> : <EmptyState title="No prompts yet" subtitle="Add prompts to begin building this collection." />}</section>;
}

function CollectionPromptCard({ prompt, onAction, featured = false, owner = false, onRemove, onDragStart, onDrop }: { prompt: SavedPrompt; onAction: (label: string) => void; featured?: boolean; owner?: boolean; onRemove?: () => void; onDragStart?: () => void; onDrop?: () => void }) {
  const { isSaved, toggleSaved } = useSavedPrompts();
  const saved = isSaved(prompt.id);
  const Icon = prompt.icon;
  return <motion.article whileHover={{ y: -2 }} draggable={Boolean(onDragStart)} onDragStart={onDragStart} onDragOver={(event) => onDrop && event.preventDefault()} onDrop={onDrop} className={cn("group rounded-2xl border border-white/[.07] bg-[#161b22] p-4 transition-shadow hover:border-violet-500/25 hover:shadow-xl", featured && "p-5")}>
    <div className="flex items-start gap-3"><span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", prompt.accent)}><Icon className="size-5" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-slate-100">{prompt.title}</h3><p className="mt-1 text-[9px] text-slate-700">{prompt.author} · {prompt.version}</p></div><span className="inline-flex items-center gap-1 text-[9px] text-amber-400"><Star className="size-3 fill-current" />{prompt.rating}</span></div>
    <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">{prompt.description}</p>
    <div className="mt-3 flex flex-wrap gap-1">{prompt.models.map((model) => <Badge key={model} className="py-0.5 text-[8px]">{model}</Badge>)}</div>
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/[.06] pt-3 text-[9px] text-slate-600"><span>{formatCompact(prompt.copies)} uses</span><span>{formatCompact(prompt.copies)} copies</span><span>{saved ? "Saved" : "Not saved"}</span><span className="ml-auto text-violet-400/70">Source: {prompt.visibility === "Public" ? "Explore" : "My Prompts"}</span></div>
    <div className="mt-3 flex flex-wrap gap-1"><Button size="sm" variant="ghost" onClick={() => onAction(`Opened ${prompt.title}`)}>Open</Button><Button size="sm" variant="ghost" onClick={() => onAction(`${prompt.title} copied`)}>Copy</Button><Button size="sm" variant="ghost" onClick={() => onAction(`${prompt.title} forked`)}><GitFork className="size-3" /> Fork</Button><Button size="sm" variant="ghost" onClick={() => toggleSaved(prompt.id)}><Bookmark className={cn("size-3", saved && "fill-violet-400 text-violet-400")} />{saved ? "Saved" : "Save"}</Button>{owner && <><Button size="sm" variant="ghost" onClick={() => onAction(`Add ${prompt.title} to collection`)}>Move</Button><Button size="sm" variant="ghost" className="text-rose-400" onClick={onRemove}>Remove</Button></>}</div>
  </motion.article>;
}

function PromptsTab({ prompts, owner, onRemove, onAction, onDragStart, onDrop }: { prompts: SavedPrompt[]; owner: boolean; onRemove: (id: string) => void; onAction: (label: string) => void; onDragStart: (id: string) => void; onDrop: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [model, setModel] = useState("All models");
  const [sort, setSort] = useState("Recently Added");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filtered = prompts.filter((prompt) => (!query || `${prompt.title} ${prompt.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())) && (category === "All categories" || prompt.category === category) && (model === "All models" || prompt.models.includes(model))).sort((a, b) => sort === "A-Z" ? a.title.localeCompare(b.title) : sort === "Most Popular" ? b.copies - a.copies : a.savedOrder - b.savedOrder);
  return <div><div className="sticky top-[126px] z-10 flex flex-col gap-2 rounded-xl border border-white/[.07] bg-[#161b22]/95 p-3 backdrop-blur-xl sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collection prompts..." className="form-input pl-9" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="form-input sm:w-36"><option>All categories</option>{[...new Set(prompts.map((prompt) => prompt.category))].map((item) => <option key={item}>{item}</option>)}</select><select value={model} onChange={(event) => setModel(event.target.value)} className="form-input sm:w-32"><option>All models</option>{models.map((item) => <option key={item}>{item}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="form-input sm:w-40">{["Recently Added", "Most Popular", "Newest", "A-Z"].map((item) => <option key={item}>{item}</option>)}</select><div className="flex rounded-lg border border-white/10 bg-[#0d1117] p-1">{(["grid", "list"] as const).map((item) => <Button key={item} variant="icon" size="icon" className={cn("size-8", view === item && "bg-white/[.07] text-violet-300")} onClick={() => setView(item)}>{item === "grid" ? <Grid2X2 className="size-4" /> : <List className="size-4" />}</Button>)}</div></div>{filtered.length ? <div className={cn("mt-4 grid gap-3", view === "grid" ? "md:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1")}>{filtered.map((prompt) => <CollectionPromptCard key={prompt.id} prompt={prompt} owner={owner} onAction={onAction} onRemove={() => onRemove(prompt.id)} onDragStart={() => onDragStart(prompt.id)} onDrop={() => onDrop(prompt.id)} />)}</div> : <div className="mt-4"><EmptyState title="No prompts found" subtitle="Try changing the search or filters." /></div>}</div>;
}

function ActivityTab() {
  const groups = ["Today", "Yesterday", "This Week", "Earlier"];
  return <div className="space-y-5">{groups.map((group) => { const entries = groupedActivity.filter((item) => item.group === group); return <section key={group}><h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[.14em] text-slate-600">{group}</h2><div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5">{entries.map((item, index) => <div key={item.action} className="relative flex gap-3 pb-6 last:pb-0">{index < entries.length - 1 && <span className="absolute bottom-0 left-3 top-7 w-px bg-white/[.07]" />}<span className="relative mt-1 size-6 rounded-full border border-violet-500/20 bg-violet-500/10" /><div><p className="text-xs font-medium text-slate-300">{item.action}</p><p className="mt-1 text-[11px] text-slate-600">{item.detail}</p><p className="mt-1 text-[9px] text-slate-800">{item.time}</p></div></div>)}</div></section>; })}</div>;
}

function MembersTab() {
  const members = [["VD", "Van Duc", "Owner", "May 18, 2026", "Now"], ["MT", "Minh Trần", "Admin", "May 21, 2026", "1 hour ago"], ["AP", "An Phạm", "Editor", "June 02, 2026", "Yesterday"], ["LH", "Linh Hoàng", "Viewer", "June 10, 2026", "3 days ago"]];
  return members.length ? <div className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]"><div className="flex items-center justify-between border-b border-white/[.06] p-4"><h2 className="text-sm font-semibold text-slate-200">Collection members</h2><Button size="sm" className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400"><Users className="size-3.5" /> Invite Member</Button></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-xs"><thead className="text-[9px] uppercase tracking-wider text-slate-700"><tr>{["Member", "Role", "Joined", "Last active", ""].map((item) => <th key={item} className="px-4 py-3 font-medium">{item}</th>)}</tr></thead><tbody className="divide-y divide-white/[.06]">{members.map(([initials, name, role, joined, active]) => <tr key={name}><td className="px-4 py-3"><span className="flex items-center gap-2"><Avatar initials={initials} className="size-8 text-[9px]" />{name}</span></td><td className="px-4 py-3"><select defaultValue={role} disabled={role === "Owner"} className="rounded-lg border border-white/[.07] bg-[#0d1117] px-2 py-1.5 text-[10px] text-slate-500">{["Owner", "Admin", "Editor", "Viewer"].map((item) => <option key={item}>{item}</option>)}</select></td><td className="px-4 py-3 text-slate-600">{joined}</td><td className="px-4 py-3 text-slate-600">{active}</td><td className="px-4 py-3"><Button variant="ghost" size="sm" disabled={role === "Owner"}>Remove</Button></td></tr>)}</tbody></table></div></div> : <EmptyState title="No members" subtitle="Invite a teammate to collaborate." />;
}

function SettingsTab({ collection, onEdit, onDuplicate, onDelete, onAction }: { collection: PromptCollection; onEdit: () => void; onDuplicate: () => void; onDelete: () => void; onAction: (label: string) => void }) {
  const [comments, setComments] = useState(collection.allowComments);
  const [followers, setFollowers] = useState(collection.allowFollowers);
  const [copying, setCopying] = useState(true);
  const [forks, setForks] = useState(true);
  return <div className="space-y-4"><Panel title="General"><p className="text-xs leading-5 text-slate-600">Update the collection name, description, cover, visibility, tags, and color.</p><Button variant="secondary" className="mt-4" onClick={onEdit}><Edit3 className="size-4" /> Edit general settings</Button></Panel><Panel title="Permissions"><div className="space-y-2"><SettingToggle label="Allow comments" value={comments} onChange={setComments} /><SettingToggle label="Allow followers" value={followers} onChange={setFollowers} /><SettingToggle label="Allow copying" value={copying} onChange={setCopying} /><SettingToggle label="Allow forks" value={forks} onChange={setForks} /></div></Panel><section className="rounded-2xl border border-rose-500/15 bg-rose-500/[.025] p-5"><h2 className="text-sm font-semibold text-rose-300">Danger Zone</h2><p className="mt-1 text-xs text-slate-600">Archiving hides this collection. Deleting it never deletes the original prompts.</p><div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => onAction("Collection archived")}><Archive className="size-4" /> Archive Collection</Button><Button variant="secondary" onClick={onDuplicate}><Copy className="size-4" /> Duplicate</Button><Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={onDelete}><Trash2 className="size-4" /> Delete Collection</Button></div></section></div>;
}

function SettingToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!value)} className="flex w-full items-center justify-between rounded-xl border border-white/[.07] bg-[#0d1117] px-3 py-3 text-xs text-slate-400"><span>{label}</span><span className={cn("relative h-5 w-9 rounded-full transition", value ? "bg-violet-500" : "bg-white/10")}><span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition", value ? "left-[18px]" : "left-0.5")} /></span></button>;
}

function DetailSidebar({ collection, onShare, onDuplicate, onAction }: { collection: PromptCollection; onShare: () => void; onDuplicate: () => void; onAction: (label: string) => void }) {
  return <aside className="space-y-3"><SideCard title="Collection Information"><Info label="Owner" value={collection.owner} /><Info label="Visibility" value={collection.visibility} /><Info label="Created" value={collection.createdAt} /><Info label="Updated" value={collection.updatedAt} /><Info label="Prompt Count" value={String(collection.promptIds.length)} /><Info label="Followers" value={formatCompact(collection.followers)} /><Info label="Views" value={formatCompact(collection.views)} /><Info label="Language" value="English" /><div className="mt-3 flex flex-wrap gap-1">{models.map((model) => <Badge key={model} className="py-0.5 text-[8px]">{model}</Badge>)}</div></SideCard><SideCard title="Quick Actions"><div className="space-y-1"><Button variant="ghost" className="w-full justify-start" onClick={onShare}><Share2 className="size-4" /> Share</Button><Button variant="ghost" className="w-full justify-start" onClick={onDuplicate}><Copy className="size-4" /> Duplicate</Button><Button variant="ghost" className="w-full justify-start" onClick={() => onAction("Collection exported")}><Download className="size-4" /> Export</Button></div></SideCard><SideCard title="Related Collections">{["Java Interview", "Spring Boot", "Microservices", "REST API"].map((item) => <button type="button" key={item} className="block w-full rounded-lg px-2 py-2 text-left text-[11px] text-slate-600 hover:bg-white/[.04] hover:text-violet-300">{item}</button>)}</SideCard><SideCard title="Popular Tags"><div className="flex flex-wrap gap-1">{collection.tags.map((item) => <Badge key={item}>{item}</Badge>)}</div></SideCard></aside>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><h2 className="text-sm font-semibold text-slate-300">{title}</h2><div className="mt-3">{children}</div></section>; }
function SideCard({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500">{title}</h2><div className="mt-3">{children}</div></section>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-3 border-b border-white/[.05] py-2 text-[10px] last:border-0"><span className="text-slate-700">{label}</span><span className="text-right text-slate-400">{value}</span></div>; }
function EmptyState({ title, subtitle }: { title: string; subtitle: string }) { return <div className="rounded-2xl border border-dashed border-white/[.08] py-14 text-center"><FolderPlus className="mx-auto size-7 text-slate-700" /><h3 className="mt-3 text-sm text-slate-400">{title}</h3><p className="mt-1.5 text-xs text-slate-700">{subtitle}</p></div>; }

function DetailSkeleton() {
  return <div className="mx-auto max-w-[1680px] animate-pulse px-4 py-6 sm:px-6 xl:px-8"><div className="h-4 w-52 rounded bg-white/[.04]" /><div className="mt-5 h-80 rounded-2xl border border-white/[.06] bg-[#161b22]" /><div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <div key={index} className="h-24 rounded-2xl border border-white/[.06] bg-[#161b22]" />)}</div><div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_290px]"><div className="h-[560px] rounded-2xl border border-white/[.06] bg-[#161b22]" /><div className="h-96 rounded-2xl border border-white/[.06] bg-[#161b22]" /></div></div>;
}
