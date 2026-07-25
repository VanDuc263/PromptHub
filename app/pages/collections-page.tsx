import { Folder, Globe2, Grid2X2, List, LockKeyhole, Plus, Search, SearchX, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { CollectionCard } from "@/components/collections/collection-card";
import { CollectionDetail } from "@/components/collections/collection-detail";
import { CollectionFormDialog, DeleteCollectionDialog, ShareCollectionDialog } from "@/components/collections/collection-dialogs";
import { Button } from "@/components/ui/button";
import { collectionStats } from "@/data/collections-data";
import { useCollections } from "@/hooks/use-collections";
import { cn } from "@/lib/utils";
import type { PromptCollection } from "@/types";

const statIcons = [Folder, Globe2, LockKeyhole, Users];

export function CollectionsPage({ onAction }: { onAction: (label: string) => void }) {
  const { collections, deleteCollection, duplicateCollection, addPrompts } = useCollections();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("All");
  const [sort, setSort] = useState("Recently Updated");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [formOpen, setFormOpen] = useState(false);
  const [editCollection, setEditCollection] = useState<PromptCollection | null>(null);
  const [shareCollection, setShareCollection] = useState<PromptCollection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PromptCollection | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const timeout = window.setTimeout(() => setLoading(false), 500); return () => window.clearTimeout(timeout); }, []);
  useEffect(() => { const focus = () => searchRef.current?.focus(); window.addEventListener("prompthub:focus-collections-search", focus); return () => window.removeEventListener("prompthub:focus-collections-search", focus); }, []);

  const visible = useMemo(() => collections.filter((collection) => {
    const matchQuery = `${collection.name} ${collection.description} ${collection.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (visibility === "All" || collection.visibility === visibility);
  }).sort((a, b) => sort === "A-Z" ? a.name.localeCompare(b.name) : sort === "Most Prompts" ? b.promptIds.length - a.promptIds.length : b.id.localeCompare(a.id)), [collections, query, sort, visibility]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= visible.length) return;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisibleCount((count) => Math.min(count + 4, visible.length)), { rootMargin: "180px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [visible.length, visibleCount]);

  const selected = collections.find((collection) => collection.id === selectedId);
  if (selected) return <><CollectionDetail collection={selected} onBack={() => setSelectedId(null)} onEdit={() => { setEditCollection(selected); setFormOpen(true); }} onShare={() => setShareCollection(selected)} onDuplicate={() => { duplicateCollection(selected.id); onAction("Collection duplicated"); }} onDelete={() => setDeleteTarget(selected)} onAction={onAction} /><CollectionFormDialog key={editCollection?.id} open={formOpen} onOpenChange={setFormOpen} collection={editCollection} /><ShareCollectionDialog open={Boolean(shareCollection)} onOpenChange={(open) => !open && setShareCollection(null)} collection={shareCollection} /><DeleteCollectionDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} collection={deleteTarget} onConfirm={() => { deleteCollection(selected.id); setDeleteTarget(null); setSelectedId(null); onAction("Collection deleted"); }} /></>;

  return <>
    <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-emerald-400">Prompt library</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Collections</h1><p className="mt-2 text-sm text-slate-500">Organize your prompts into reusable collections.</p></div><Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => { setEditCollection(null); setFormOpen(true); }}><Plus className="size-4" /> New Collection</Button></header>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{collectionStats.map((stat, index) => { const Icon = statIcons[index]; return loading ? <div key={stat.label} className="h-24 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" /> : <motion.div key={stat.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .05 }} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><div className="flex items-center justify-between"><p className="text-[10px] uppercase tracking-[.12em] text-slate-600">{stat.label}</p><Icon className="size-4 text-emerald-400" /></div><p className="mt-3 text-2xl font-semibold text-slate-100">{stat.value}</p></motion.div>; })}</div>
      <div className="sticky top-[72px] z-20 -mx-4 mt-6 flex flex-col gap-2 border-y border-white/[.06] bg-[#0d1117]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:flex-row sm:px-6 xl:-mx-8 xl:px-8">
        <label className="relative min-w-0 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input ref={searchRef} value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(8); }} placeholder="Search collections..." className="form-input pl-9" /></label>
        <select value={visibility} onChange={(event) => { setVisibility(event.target.value); setVisibleCount(8); }} className="form-input sm:w-36"><option>All</option><option>Private</option><option>Public</option><option>Team</option></select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="form-input sm:w-44">{["Recently Updated", "Recently Created", "Most Prompts", "A-Z"].map((item) => <option key={item}>{item}</option>)}</select>
        <div className="flex rounded-lg border border-white/10 bg-[#161b22] p-1">{(["grid", "list"] as const).map((item) => <Button key={item} variant="icon" size="icon" aria-label={`${item} view`} onClick={() => setView(item)} className={cn("size-8", view === item && "bg-white/[.08] text-emerald-400")}>{item === "grid" ? <Grid2X2 className="size-4" /> : <List className="size-4" />}</Button>)}</div>
      </div>
      <main className="mt-5">{loading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl border border-white/[.06] bg-[#161b22]" />)}</div> : !visible.length ? <div className="rounded-2xl border border-dashed border-white/[.08] px-6 py-20 text-center"><div className="relative mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-500/[.05]"><Folder className="size-7 text-emerald-400/60" /><SearchX className="absolute -bottom-1 -right-1 size-5 rounded-full bg-[#0d1117] p-1 text-slate-500" /></div><h2 className="mt-5 text-base font-semibold text-slate-200">No collections yet</h2><p className="mt-2 text-sm text-slate-600">Create your first collection to organize prompts.</p><Button className="mt-6 bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => setFormOpen(true)}>Create Collection</Button></div> : <><motion.div layout className={cn("grid gap-3", view === "grid" ? "sm:grid-cols-2 xl:grid-cols-4" : "grid-cols-1")}>{visible.slice(0, visibleCount).map((collection) => <CollectionCard key={collection.id} collection={collection} list={view === "list"} onOpen={() => setSelectedId(collection.id)} onEdit={() => { setEditCollection(collection); setFormOpen(true); }} onShare={() => setShareCollection(collection)} onDuplicate={() => { duplicateCollection(collection.id); onAction("Collection duplicated"); }} onDelete={() => setDeleteTarget(collection)} onDropPrompt={(promptId) => { addPrompts([collection.id], [promptId]); onAction(`Prompt moved to ${collection.name}`); }} />)}</motion.div><div ref={loadMoreRef} className="h-12" /></>}</main>
    </div>
    <CollectionFormDialog key={editCollection?.id ?? "new"} open={formOpen} onOpenChange={setFormOpen} collection={editCollection} onDone={() => onAction(editCollection ? "Collection updated" : "Collection created")} />
    <ShareCollectionDialog open={Boolean(shareCollection)} onOpenChange={(open) => !open && setShareCollection(null)} collection={shareCollection} />
    <DeleteCollectionDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)} collection={deleteTarget} onConfirm={() => { if (deleteTarget) deleteCollection(deleteTarget.id); setDeleteTarget(null); onAction("Collection deleted"); }} />
  </>;
}
