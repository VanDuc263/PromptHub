import { Archive, ArrowLeft, Bell, Copy, Edit3, FolderPlus, GitFork, Globe2, LockKeyhole, MoreHorizontal, Share2, Star, Trash2, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { AddPromptsDialog } from "@/components/collections/collection-dialogs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collectionActivity } from "@/data/collections-data";
import { savedPromptCatalog } from "@/data/saved-data";
import { useCollections } from "@/hooks/use-collections";
import { cn, formatCompact } from "@/lib/utils";
import type { PromptCollection, SavedPrompt } from "@/types";

const tabs = ["Overview", "Prompts", "Activity", "Members", "Settings"];

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
  const { removePrompt, toggleFollow } = useCollections();
  const [tab, setTab] = useState("Overview");
  const [addOpen, setAddOpen] = useState(false);
  const prompts = useMemo(() => savedPromptCatalog.filter((prompt) => collection.promptIds.includes(prompt.id)), [collection.promptIds]);

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-xs text-slate-500 transition hover:text-emerald-400"><ArrowLeft className="size-4" /> Back to Collections</button>
        <section className="mt-5 overflow-hidden rounded-2xl border border-white/[.07] bg-[#161b22]">
          <div className="relative h-36 bg-gradient-to-br from-emerald-500/20 via-sky-500/[.06] to-transparent">
            <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_center,rgba(52,211,153,.45)_1px,transparent_1px)] [background-size:20px_20px]" />
          </div>
          <div className="p-5 sm:p-6">
            <div className="-mt-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="relative">
                <div className="grid size-20 place-items-center rounded-2xl border-4 border-[#161b22] bg-[#0d1117] text-emerald-300 shadow-xl"><FolderPlus className="size-8" /></div>
                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-50">{collection.name}</h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{collection.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={onEdit}><Edit3 className="size-4" /> Edit Collection</Button>
                <Button variant="secondary" onClick={onShare}><Share2 className="size-4" /> Share</Button>
                {collection.visibility === "Public" && <Button variant="secondary" onClick={() => toggleFollow(collection.id)}><Bell className={cn("size-4", collection.following && "fill-emerald-400 text-emerald-400")} />{collection.following ? "Following" : "Follow"}</Button>}
                <Button variant="secondary" onClick={onDuplicate}><Copy className="size-4" /> Duplicate</Button>
                <Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => setAddOpen(true)}><FolderPlus className="size-4" /> Add Prompt</Button>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] text-slate-600">
              <span className="inline-flex items-center gap-2"><Avatar initials={collection.ownerInitials} className="size-6 text-[8px]" />{collection.owner}</span>
              <Badge>{collection.visibility === "Private" ? <LockKeyhole className="mr-1 size-3" /> : collection.visibility === "Public" ? <Globe2 className="mr-1 size-3" /> : <Users className="mr-1 size-3" />}{collection.visibility}</Badge>
              <span>{collection.promptIds.length} prompts</span><span>{formatCompact(collection.followers)} followers</span><span>Created {collection.createdAt}</span><span>Updated {collection.updatedAt.toLowerCase()}</span>
            </div>
          </div>
        </section>

        <div className="sticky top-[72px] z-20 mt-5 flex gap-1 overflow-x-auto rounded-xl border border-white/[.07] bg-[#0d1117]/95 p-1.5 backdrop-blur-xl">
          {tabs.filter((item) => item !== "Members" || collection.visibility === "Team").map((item) => <button type="button" key={item} onClick={() => setTab(item)} className={cn("shrink-0 rounded-lg px-4 py-2 text-xs transition", tab === item ? "bg-white/[.07] text-emerald-300" : "text-slate-600 hover:text-slate-300")}>{item}</button>)}
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <main className="min-w-0">
            {tab === "Overview" && <Overview prompts={prompts} onOpen={onAction} />}
            {tab === "Prompts" && <PromptGrid prompts={prompts} onRemove={(id) => removePrompt(collection.id, id)} onAction={onAction} />}
            {tab === "Activity" && <Activity />}
            {tab === "Members" && <Members />}
            {tab === "Settings" && <Settings collection={collection} onDuplicate={onDuplicate} onDelete={onDelete} onAction={onAction} />}
          </main>
          <DetailSidebar collection={collection} />
        </div>
      </motion.div>
      <AddPromptsDialog open={addOpen} onOpenChange={setAddOpen} collectionId={collection.id} />
    </>
  );
}

function Overview({ prompts, onOpen }: { prompts: SavedPrompt[]; onOpen: (label: string) => void }) {
  return <div className="space-y-5"><section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-emerald-400">About this collection</p><p className="mt-3 text-sm leading-7 text-slate-500">A curated working set for designing, reviewing, and shipping reliable backend systems. Prompts are organized for repeatable engineering workflows and practical team use.</p><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Prompt coverage", `${prompts.length} workflows`], ["Average rating", "4.8 / 5"], ["Last activity", "2 hours ago"]].map(([label, value]) => <div key={label} className="rounded-xl bg-[#0d1117] p-4"><p className="text-[9px] text-slate-700">{label}</p><p className="mt-2 text-sm font-semibold text-slate-300">{value}</p></div>)}</div></section><Section title="Pinned prompts"><PromptGrid prompts={prompts.slice(0, 2)} onRemove={() => undefined} onAction={onOpen} compact /></Section><Section title="Recent prompts"><PromptGrid prompts={prompts.slice(0, 3)} onRemove={() => undefined} onAction={onOpen} compact /></Section><Section title="Recent activity"><Activity /></Section></div>;
}
function PromptGrid({ prompts, onRemove, onAction, compact = false }: { prompts: SavedPrompt[]; onRemove: (id: string) => void; onAction: (label: string) => void; compact?: boolean }) {
  if (!prompts.length) return <div className="rounded-2xl border border-dashed border-white/[.08] py-14 text-center text-sm text-slate-600">No prompts in this collection yet.</div>;
  return <div className={cn("grid gap-3", compact ? "md:grid-cols-2" : "md:grid-cols-2 2xl:grid-cols-3")}>{prompts.map((prompt) => <article key={prompt.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/prompt-id", prompt.id)} className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4 transition hover:border-emerald-500/20"><div className="flex items-start gap-3"><span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", prompt.accent)}><prompt.icon className="size-4" /></span><div className="min-w-0"><h3 className="truncate text-xs font-semibold text-slate-200">{prompt.title}</h3><p className="mt-1 text-[9px] text-slate-700">{prompt.author} · {prompt.version}</p></div><Star className="ml-auto size-3.5 fill-amber-400 text-amber-400" /></div><p className="mt-3 line-clamp-2 text-[11px] leading-5 text-slate-500">{prompt.description}</p><div className="mt-3 flex flex-wrap gap-1">{prompt.models.slice(0, 2).map((model) => <Badge key={model} className="py-0.5 text-[8px]">{model}</Badge>)}</div><div className="mt-4 flex flex-wrap gap-1 border-t border-white/[.06] pt-3"><Button size="sm" variant="ghost" onClick={() => onAction(`Opened ${prompt.title}`)}>Open</Button><Button size="sm" variant="ghost" onClick={() => onAction(`${prompt.title} copied`)}>Copy</Button><Button size="sm" variant="ghost" onClick={() => onAction(`${prompt.title} forked`)}><GitFork className="size-3" /> Fork</Button>{!compact && <Button size="sm" variant="ghost" className="text-rose-400" onClick={() => onRemove(prompt.id)}>Remove</Button>}</div></article>)}</div>;
}

function Activity() { return <div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5">{collectionActivity.map((item, index) => <div key={`${item.action}-${item.time}`} className="relative flex gap-3 pb-6 last:pb-0">{index < collectionActivity.length - 1 && <span className="absolute bottom-0 left-3 top-7 w-px bg-white/[.07]" />}<span className="relative mt-1 size-6 rounded-full border border-emerald-500/20 bg-emerald-500/10" /><div><p className="text-xs font-medium text-slate-300">{item.action}</p><p className="mt-1 text-[11px] text-slate-600">{item.detail}</p><p className="mt-1 text-[9px] text-slate-800">{item.time}</p></div></div>)}</div>; }
function Members() { return <div className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><div className="flex items-center justify-between"><h2 className="text-sm font-semibold text-slate-200">Workspace members</h2><Button size="sm" className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400"><Users className="size-3.5" /> Invite member</Button></div><div className="mt-4 divide-y divide-white/[.06]">{[["VD", "Van Duc", "Owner"], ["MT", "Minh Trần", "Admin"], ["AP", "An Phạm", "Editor"], ["LH", "Linh Hoàng", "Viewer"]].map(([initials, name, role]) => <div key={name} className="flex items-center py-3"><Avatar initials={initials} className="size-8 text-[9px]" /><span className="ml-3 text-xs text-slate-300">{name}</span><select defaultValue={role} className="ml-auto rounded-lg border border-white/[.07] bg-[#0d1117] px-2 py-1.5 text-[10px] text-slate-500"><option>Owner</option><option>Admin</option><option>Editor</option><option>Viewer</option></select><Button variant="icon" size="icon" className="ml-1 size-8"><MoreHorizontal className="size-4" /></Button></div>)}</div></div>; }
function Settings({ collection, onDuplicate, onDelete, onAction }: { collection: PromptCollection; onDuplicate: () => void; onDelete: () => void; onAction: (label: string) => void }) { return <div className="space-y-4"><section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><h2 className="text-sm font-semibold text-slate-200">Visibility</h2><p className="mt-1 text-xs text-slate-600">Control who can discover and use this collection.</p><select defaultValue={collection.visibility} className="form-input mt-4 max-w-xs"><option>Private</option><option>Public</option><option>Team</option></select></section><section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-5"><h2 className="text-sm font-semibold text-slate-200">Collection actions</h2><div className="mt-4 flex flex-wrap gap-2"><Button variant="secondary" onClick={() => onAction("Collection archived")}><Archive className="size-4" /> Archive</Button><Button variant="secondary" onClick={() => onAction("Collection exported")}><Share2 className="size-4" /> Export</Button><Button variant="secondary" onClick={onDuplicate}><Copy className="size-4" /> Duplicate</Button><Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={onDelete}><Trash2 className="size-4" /> Delete Collection</Button></div></section></div>; }
function DetailSidebar({ collection }: { collection: PromptCollection }) { return <aside className="space-y-3"><Side title="Collection statistics" items={[`${collection.promptIds.length} prompts`, `${formatCompact(collection.followers)} followers`, `${formatCompact(collection.views)} views`]} /><Side title="Recent contributors" items={["Van Duc · Owner", "Minh Trần · 4 changes", "An Phạm · 2 changes"]} /><Side title="Related collections" items={["Microservice Essentials", "System Design Reviews", "API Quality Toolkit"]} /><Side title="Popular tags" items={collection.tags} /></aside>; }
function Side({ title, items }: { title: string; items: string[] }) { return <section className="rounded-2xl border border-white/[.07] bg-[#161b22] p-4"><h2 className="text-[10px] font-semibold uppercase tracking-[.12em] text-slate-500">{title}</h2><div className="mt-3 space-y-1">{items.map((item) => <div key={item} className="rounded-lg px-2 py-2 text-[11px] text-slate-600">{item}</div>)}</div></section>; }
function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="mb-3 text-sm font-semibold text-slate-300">{title}</h2>{children}</section>; }
