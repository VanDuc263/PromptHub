import * as Dialog from "@radix-ui/react-dialog";
import { AlertTriangle, Check, Copy, Image, Link2, LoaderCircle, Search, Tag, Trash2, Upload, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCollections } from "@/hooks/use-collections";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchExplorePrompts } from "@/store/explore-slice";
import { fetchMyPrompts } from "@/store/my-prompts-slice";
import { fetchSavedPrompts } from "@/store/saved-prompts-slice";
import type { CollectionVisibility, PromptCollection } from "@/types";

function ModalShell({ open, onOpenChange, title, subtitle, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; subtitle: string; children: React.ReactNode }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[111] max-h-[88vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl outline-none"><Dialog.Title className="text-lg font-semibold text-slate-100">{title}</Dialog.Title><Dialog.Description className="mt-1.5 text-xs text-slate-500">{subtitle}</Dialog.Description><Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-white/[.05] hover:text-slate-200"><X className="size-4" /></Dialog.Close>{children}</Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export function CollectionFormDialog({ open, onOpenChange, collection, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; collection?: PromptCollection | null; onDone?: (id: string) => void }) {
  const { createCollection, updateCollection, createStatus, error } = useCollections();
  const [name, setName] = useState(collection?.name ?? "");
  const [description, setDescription] = useState(collection?.description ?? "");
  const [visibility, setVisibility] = useState<CollectionVisibility>(collection?.visibility ?? "Private");
  const [color, setColor] = useState(collection?.color ?? "emerald");
  const [tags, setTags] = useState(collection?.tags.join(", ") ?? "");
  const [comments, setComments] = useState(collection?.allowComments ?? true);
  const [followers, setFollowers] = useState(collection?.allowFollowers ?? false);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(collection?.coverImageUrl ?? null);
  const [localCoverImageUrl, setLocalCoverImageUrl] = useState<string | null>(collection?.localCoverImageUrl ?? null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const systemCovers = [
    "/collection-covers/ai-network.svg",
    ...["aurora", "circuit", "sunset", "grid"].map((name) => `/collection-covers/${name}.svg`),
  ];
  const submit = async () => {
    if (!name.trim()) return;
    const patch = { name: name.trim(), description, visibility, color, tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean), allowComments: comments, allowFollowers: followers, owner: collection?.owner ?? "Van Duc", ownerInitials: collection?.ownerInitials ?? "VD", coverImageUrl, localCoverImageUrl };
    if (collection) {
      updateCollection(collection.id, patch);
      onDone?.(collection.id);
      onOpenChange(false);
      return;
    }
    const id = await createCollection(patch);
    if (id) {
      onDone?.(id);
      onOpenChange(false);
    }
  };
  const selectPersonalImage = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("Personal images must be 10 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError("Could not preview this image.");
        return;
      }
      setLocalCoverImageUrl(reader.result);
      setCoverImageUrl(null);
      setImageError(null);
    };
    reader.onerror = () => setImageError("Could not read this image.");
    reader.readAsDataURL(file);
  };
  const coverPreview = localCoverImageUrl ?? coverImageUrl;
  return <ModalShell open={open} onOpenChange={onOpenChange} title={collection ? "Edit Collection" : "Create New Collection"} subtitle="Build a reusable folder for related prompts.">
    <div className="mt-5 space-y-4">
      <div>
        <span className="mb-2 block text-[10px] font-medium uppercase tracking-[.1em] text-slate-600">Cover image</span>
        {coverPreview ? <div className="relative h-28 overflow-hidden rounded-xl border border-white/10"><img src={coverPreview} alt="Collection cover preview" className="size-full object-cover" onError={() => setImageError("This image could not be previewed.")} /><button type="button" onClick={() => { setLocalCoverImageUrl(null); setCoverImageUrl(null); }} className="absolute right-2 top-2 grid size-7 place-items-center rounded-lg bg-black/65 text-white"><X className="size-3.5" /></button></div> : <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1117]/60 text-xs text-slate-600"><Image className="mr-2 size-4" />Choose a cover below</div>}
        <p className="mt-3 text-[10px] text-slate-500">PromptHub covers</p>
        <div className="mt-2 grid grid-cols-4 gap-2">{systemCovers.map((cover) => <button key={cover} type="button" onClick={() => { setLocalCoverImageUrl(null); setCoverImageUrl(cover); setImageError(null); }} className={cn("h-14 overflow-hidden rounded-lg border transition", coverImageUrl === cover && !localCoverImageUrl ? "border-emerald-400 ring-2 ring-emerald-500/20" : "border-white/10 hover:border-white/25")}><img src={cover} alt="" className="size-full object-cover" /></button>)}</div>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { selectPersonalImage(event.target.files?.[0]); event.target.value = ""; }} />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/10 bg-[#0d1117]/60 text-xs text-slate-500 hover:border-emerald-500/25 hover:text-emerald-400"><Upload className="size-4" />Choose from your device</button>
        <p className="mt-1.5 text-[9px] text-slate-600">Personal images are previewed locally only and are not uploaded to the server yet.</p>
        {imageError && <p className="mt-1.5 text-xs text-rose-400">{imageError}</p>}
      </div>
      <Field label="Collection name"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Java Backend Essentials" className="form-input" /></Field>
      <Field label="Description"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="What belongs in this collection?" className="form-input resize-none py-3" /></Field>
      <div className="grid gap-4 sm:grid-cols-2"><Field label="Visibility"><select value={visibility} onChange={(event) => setVisibility(event.target.value as CollectionVisibility)} className="form-input">{["Private", "Public", "Team"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Color"><select value={color} onChange={(event) => setColor(event.target.value)} className="form-input">{["emerald", "violet", "sky", "amber", "rose", "fuchsia"].map((item) => <option key={item}>{item}</option>)}</select></Field></div>
      <Field label="Tags"><div className="relative"><Tag className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" /><input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Java, Spring Boot, Architecture" className="form-input pl-9" /></div></Field>
      <Toggle checked={comments} onChange={setComments} label="Allow comments" /><Toggle checked={followers} onChange={setFollowers} label="Allow followers" />
      {!collection && createStatus === "failed" && error && <p className="text-xs text-rose-400">{error}</p>}
      <div className="flex justify-end gap-2 pt-2"><Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button><Button className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" disabled={!name.trim() || createStatus === "loading"} onClick={() => void submit()}>{createStatus === "loading" ? "Creating..." : collection ? "Save changes" : "Create Collection"}</Button></div>
    </div>
  </ModalShell>;
}

export function AddToCollectionDialog({ open, onOpenChange, promptTitle, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; promptTitle: string; onDone?: () => void }) {
  const { collections, addPrompts, error } = useCollections();
  const myPrompts = useAppSelector((state) => state.myPrompts.prompts);
  const savedPrompts = useAppSelector((state) => state.savedPrompts.prompts);
  const explorePrompts = useAppSelector((state) => state.explore.prompts);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const promptId = [...myPrompts, ...savedPrompts, ...explorePrompts].find((prompt) => prompt.title === promptTitle)?.id;
  const visible = collections.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  return <ModalShell open={open} onOpenChange={onOpenChange} title="Add to Collection" subtitle={`Choose where to add “${promptTitle}”.`}>
    <div className="relative mt-5"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search collections..." className="form-input pl-9" /></div>
    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{visible.map((collection) => <button key={collection.id} type="button" onClick={() => setSelected((ids) => ids.includes(collection.id) ? ids.filter((id) => id !== collection.id) : [...ids, collection.id])} className={cn("flex w-full items-center rounded-xl border p-3 text-left transition", selected.includes(collection.id) ? "border-emerald-500/30 bg-emerald-500/[.07]" : "border-white/[.07] hover:bg-white/[.03]")}><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-300">{collection.name}</strong><span className="mt-1 block text-[9px] text-slate-700">{collection.promptIds.length} prompts · {collection.visibility}</span></span><span className={cn("grid size-6 place-items-center rounded-md border", selected.includes(collection.id) ? "border-emerald-400 bg-emerald-500 text-[#07120b]" : "border-white/10")}><Check className="size-3.5" /></span></button>)}</div>
    {!promptId && <p className="mt-3 text-xs text-amber-400">This prompt is not available in your current library. Refresh its source and try again.</p>}
    {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
    <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" disabled={submitting} onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!selected.length || !promptId || submitting} className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => { if (!promptId) return; setSubmitting(true); void addPrompts(selected, [promptId]).then((added) => { setSubmitting(false); if (!added) return; onDone?.(); onOpenChange(false); }); }}>{submitting && <LoaderCircle className="size-4 animate-spin" />}Add Selected ({selected.length})</Button></div>
  </ModalShell>;
}

export function AddPromptsDialog({ open, onOpenChange, collectionId, onDone }: { open: boolean; onOpenChange: (open: boolean) => void; collectionId: string; onDone?: (count: number) => void }) {
  const { addPrompts, collections, error: collectionError } = useCollections();
  const dispatch = useAppDispatch();
  const myPromptsState = useAppSelector((state) => state.myPrompts);
  const savedPromptsState = useAppSelector((state) => state.savedPrompts);
  const exploreState = useAppSelector((state) => state.explore);
  const [source, setSource] = useState<"My Prompts" | "Saved" | "Explore">("My Prompts");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const collection = collections.find((item) => item.id === collectionId);

  useEffect(() => {
    if (!open) return;
    if (myPromptsState.status === "idle") void dispatch(fetchMyPrompts());
    if (savedPromptsState.status === "idle") void dispatch(fetchSavedPrompts());
    if (exploreState.status === "idle") void dispatch(fetchExplorePrompts());
  }, [dispatch, exploreState.status, myPromptsState.status, open, savedPromptsState.status]);

  const promptsBySource = useMemo(() => ({
    "My Prompts": myPromptsState.prompts.map((prompt) => ({ ...prompt, models: [] as string[] })),
    Saved: savedPromptsState.prompts,
    Explore: exploreState.prompts,
  }), [exploreState.prompts, myPromptsState.prompts, savedPromptsState.prompts]);
  const sourceState = source === "My Prompts" ? myPromptsState : source === "Saved" ? savedPromptsState : exploreState;
  const normalizedQuery = query.trim().toLowerCase();
  const prompts = promptsBySource[source].filter((prompt) =>
    !collection?.promptIds.includes(prompt.id) &&
    (!normalizedQuery || `${prompt.title} ${prompt.description} ${prompt.category} ${prompt.tags.join(" ")}`.toLowerCase().includes(normalizedQuery)));
  const close = () => {
    setSelected([]);
    setQuery("");
    setSubmitting(false);
    onOpenChange(false);
  };
  const submit = async () => {
    if (!selected.length || submitting) return;
    setSubmitting(true);
    const added = await addPrompts([collectionId], selected);
    setSubmitting(false);
    if (!added) return;
    onDone?.(selected.length);
    close();
  };

  return <ModalShell open={open} onOpenChange={(nextOpen) => nextOpen ? onOpenChange(true) : close()} title="Add Prompts" subtitle="Select prompts from your library or the community.">
    <div className="mt-5 flex gap-1 rounded-lg bg-[#0d1117] p-1">{(["My Prompts", "Saved", "Explore"] as const).map((item) => <button key={item} type="button" onClick={() => setSource(item)} className={cn("flex-1 rounded-md px-3 py-2 text-[10px]", source === item ? "bg-white/[.07] text-emerald-300" : "text-slate-600")}>{item}</button>)}</div>
    <div className="relative mt-3"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${source.toLowerCase()}...`} className="form-input pl-9" /></div>
    <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">
      {sourceState.status === "idle" || sourceState.status === "loading" ? <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500"><LoaderCircle className="size-4 animate-spin" /> Loading prompts...</div> : sourceState.status === "failed" ? <div className="flex items-center justify-center gap-2 py-12 text-xs text-rose-400"><AlertTriangle className="size-4" />{sourceState.error ?? "Could not load prompts."}</div> : prompts.length ? prompts.map((prompt) => <button key={prompt.id} type="button" onClick={() => setSelected((ids) => ids.includes(prompt.id) ? ids.filter((id) => id !== prompt.id) : [...ids, prompt.id])} className={cn("flex w-full items-center rounded-xl border p-3 text-left transition", selected.includes(prompt.id) ? "border-emerald-500/30 bg-emerald-500/[.06]" : "border-white/[.07] hover:bg-white/[.03]")}><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-300">{prompt.title}</strong><span className="mt-1 block text-[9px] text-slate-700">{prompt.category}{prompt.models[0] ? ` · ${prompt.models[0]}` : ""}</span></span><span className={cn("grid size-6 place-items-center rounded-md border", selected.includes(prompt.id) ? "border-emerald-400 bg-emerald-500 text-[#07120b]" : "border-white/10")}><Check className="size-3.5" /></span></button>) : <p className="py-12 text-center text-xs text-slate-600">{query ? "No prompts match your search." : "All available prompts are already in this collection."}</p>}
    </div>
    {collectionError && <p className="mt-3 text-xs text-rose-400">{collectionError}</p>}
    <div className="mt-5 flex justify-end gap-2"><Button variant="secondary" disabled={submitting} onClick={close}>Cancel</Button><Button disabled={!selected.length || submitting} className="bg-emerald-500 text-[#07120b] hover:bg-emerald-400" onClick={() => void submit()}>{submitting && <LoaderCircle className="size-4 animate-spin" />}Add Selected ({selected.length})</Button></div>
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
