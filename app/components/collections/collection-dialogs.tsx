import * as Dialog from "@radix-ui/react-dialog";
import { Check, Copy, Image, Link2, Search, Tag, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { savedPromptCatalog, savedKeyForTitle } from "@/data/saved-data";
import { useCollections } from "@/hooks/use-collections";
import { cn } from "@/lib/utils";
import type { CollectionVisibility, PromptCollection } from "@/types";

function ModalShell({ open, onOpenChange, title, subtitle, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; subtitle: string; children: React.ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[111] max-h-[88vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl outline-none"><Dialog.Title className="text-lg font-semibold text-slate-100">{title}</Dialog.Title><Dialog.Description className="mt-1.5 text-xs text-slate-500">{subtitle}</Dialog.Description><Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-white/[.05] hover:text-slate-200"><X className="size-4" /></Dialog.Close>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function CollectionFormDialog({ open, onOpenChange, collection, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; collection?: PromptCollection | null; onDone?: (id: string) => void }) {
  const { createCollection, updateCollection } = useCollections();
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [visibility, setVisibility] = useState<CollectionVisibility>(collection?.visibility ?? "Private");
  const [color, setColor] = useState(collection?.color ?? "emerald");
  const [tags, setTags] = useState(collection?.tags.join(", ") ?? "");
  const [comments, setComments] = useState(collection?.allowComments ?? true);
  const [followers, setFollowers] = useState(collection?.allowFollowers ?? false);
  const submit = () => {
    if (!name.trim()) return;
    const patch = { name: name.trim(), description, visibility, color, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), allowComments: comments, allowFollowers: followers, owner: collection?.owner ?? "Van Duc", ownerInitials: collection?.ownerInitials ?? "VD" };
    if (collection) { updateCollection(collection.id, patch); onDone?.(collection.id); } else onDone?.(createCollection(patch));
    onOpenChange(false);
  };
  return <ModalShell open={open} onOpenChange={onOpenChange} title={collection ? "Edit Collection" : "Create New Collection"} subtitle="Build a reusable folder for related prompts.">
    <div className="mt-5 space-y-4">
      <button type="button" className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-[#0d1117]/60 text-xs text-slate-600 hover:border-emerald-500/25 hover:text-emerald-400"><Image className="size-4" /> Upload cover image</button>
      <Field label="Collection name"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Java Backend Essentials" className="form-input" /></Field>
      <Field label="Description"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="What belongs in this collection?" className="form-input resize-none py-3" /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Visibility"><select value={visibility} onChange={(event) => setVisibility(event.target.value as CollectionVisibility)} className="form-input">{["Private", "Public", "Team"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Color"><select value={color} onChange={(event) => setColor(event.target.value)} className="form-input">{["emerald", "violet", "sky", "amber", "rose", "fuchsia"].map((item) => <option key={item}>{item}</option>)}</select></Field></div>
      <Field label="Tags"><div className="relative"><Tag className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" /><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Java, Spring Boot, Architecture" className="form-input pl-9" /></div></Field>
      <Toggle checked={comments} onChange={setComments} label="Allow comments" /><Toggle checked={followers} onChange={setFollowers} label="Allow followers" />
      <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" disabled={!name.trim()} onClick={submit}>{collection ? "Save changes" : "Create Collection"}</Button></div>
    </div>
  </ModalShell>;
}

export function AddToCollectionDialog({ open, onOpenChange, promptTitle, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; promptTitle: string; onDone?: () => void }) {
  const { collections, addPrompts } = useCollections();
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const visible = collections.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  return <ModalShell open={open} onOpenChange={onOpenChange} title="Add to Collection" subtitle={`Choose where to add “${promptTitle}”.`}>
    <div className="relative mt-5"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections..." className="form-input pl-9" /></div>
    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{visible.map((collection) => <button key={collection.id} type="button" onClick={() => setSelected((ids) => ids.includes(collection.id) ? ids.filter((id) => id !== collection.id) : [...ids, collection.id])} className={cn("flex w-full items-center rounded-xl border p-3 text-left transition", selected.includes(collection.id) ? "border-emerald-500/30 bg-emerald-500/[.07]" : "border-white/[.07] hover:bg-white/[.03]")}><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-300">{collection.name}</strong><span className="mt-1 block text-[9px] text-slate-700">{collection.promptIds.length} prompts · {collection.visibility}</span></span><span className={cn("grid size-6 place-items-center rounded-md border", selected.includes(collection.id) ? "border-emerald-400 bg-emerald-500 text-[#07120b]" : "border-white/10")}><Check className="size-3.5" /></span></button>)}</div>
    <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!selected.length} className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => { addPrompts(selected, [savedKeyForTitle(promptTitle)]); onDone?.(); onOpenChange(false); }}>Add Selected ({selected.length})</Button></div>
  </ModalShell>;
}

export function AddPromptsDialog({ open, onOpenChange, collectionId }: { open: boolean; onOpenChange: (open: boolean) => void; collectionId: string }) {
  const { addPrompts } = useCollections();
  const [source, setSource] = useState("Saved");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const prompts = useMemo(() => savedPromptCatalog.filter((prompt) => `${prompt.title} ${prompt.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <ModalShell open={open} onOpenChange={onOpenChange} title="Add Prompts" subtitle="Select prompts from your library or the community.">
    <div className="mt-5 flex gap-1 rounded-lg bg-[#0d1117] p-1">{["My Prompts", "Saved", "Explore"].map((item) => <button key={item} type="button" onClick={() => setSource(item)} className={cn("flex-1 rounded-md px-3 py-2 text-[10px]", source === item ? "bg-white/[.07] text-emerald-300" : "text-slate-600")}>{item}</button>)}</div>
    <div className="relative mt-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${source.toLowerCase()}...`} className="form-input pl-9" /></div>
    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{prompts.slice(0, 8).map((prompt) => <button key={prompt.id} type="button" onClick={() => setSelected((ids) => ids.includes(prompt.id) ? ids.filter((id) => id !== prompt.id) : [...ids, prompt.id])} className="flex w-full items-center rounded-xl border border-white/[.07] p-3 text-left hover:bg-white/[.03]"><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-300">{prompt.title}</strong><span className="mt-1 block text-[9px] text-slate-700">{prompt.category} · {prompt.models[0]}</span></span><span className={cn("grid size-6 place-items-center rounded-md border", selected.includes(prompt.id) ? "border-emerald-400 bg-emerald-500 text-[#07120b]" : "border-white/10")}><Check className="size-3.5" /></span></button>)}</div>
    <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!selected.length} className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => { addPrompts([collectionId], selected); onOpenChange(false); }}>Add Selected ({selected.length})</Button></div>
  </ModalShell>;
}

export function ShareCollectionDialog({ open, onOpenChange, collection }: { open: boolean; onOpenChange: (open: boolean) => void; collection: PromptCollection | null }) {
  return <ModalShell open={open} onOpenChange={onOpenChange} title="Share Collection" subtitle="Manage access to this reusable prompt collection."><div className="mt-5 rounded-xl border border-white/[.07] bg-[#0d1117] p-3"><p className="text-[9px] uppercase tracking-wider text-slate-700">Public link</p><div className="mt-2 flex gap-2"><input readOnly value={`prompthub.dev/collections/${collection?.id ?? ""}`} className="form-input min-w-0 flex-1" /><Button variant="secondary"><Copy className="size-3.5" /> Copy Link</Button></div></div><div className="mt-3 space-y-2"><Button variant="secondary" className="w-full justify-start"><Link2 className="size-4" /> Enable Public Link</Button><Button variant="secondary" className="w-full justify-start"><Users className="size-4" /> Invite Team Members</Button><Button variant="ghost" className="w-full justify-start text-rose-400"><Trash2 className="size-4" /> Disable Sharing</Button></div></ModalShell>;
}

export function DeleteCollectionDialog({ open, onOpenChange, collection, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; collection: PromptCollection | null; onConfirm: () => void }) {
  return <ModalShell open={open} onOpenChange={onOpenChange} title="Delete Collection?" subtitle="Deleting a collection does not delete its prompts. It only removes the organization folder."><div className="mt-6 flex justify-end gap-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-rose-500 text-white hover:bg-rose-400" onClick={onConfirm}><Trash2 className="size-4" /> Delete {collection?.name}</Button></div></ModalShell>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-[10px] font-medium uppercase tracking-[.1em] text-slate-600">{label}</span>{children}</label>; }
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) { return <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-lg border border-white/[.07] px-3 py-2.5 text-xs text-slate-400"><span>{label}</span><span className={cn("relative h-5 w-9 rounded-full transition", checked ? "bg-emerald-500" : "bg-white/10")}><span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition", checked ? "left-[18px]" : "left-0.5")} /></span></button>; }
