import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Copy,
  Github,
  ImagePlus,
  Linkedin,
  LoaderCircle,
  Mail,
  Save,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { creatorProfile } from "@/data/profile-data";
import { cn } from "@/lib/utils";

export function EditProfileDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(creatorProfile.name);
  const [username, setUsername] = useState(creatorProfile.username.slice(1));
  const [bio, setBio] = useState(creatorProfile.bio);
  const [location, setLocation] = useState(creatorProfile.location);
  const [website, setWebsite] = useState(creatorProfile.website);
  const [github, setGithub] = useState(creatorProfile.github);
  const [linkedin, setLinkedin] = useState(creatorProfile.linkedin);
  const [skills, setSkills] = useState(creatorProfile.skills);
  const [models, setModels] = useState(creatorProfile.preferredModels);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const usernameValid = /^[a-z0-9_-]{3,24}$/.test(username);

  const imagePreview = (file: File | undefined, setter: (url: string) => void) => {
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  const save = () => {
    if (!name.trim() || !usernameValid) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      onSaved();
    }, 850);
  };

  return (
    <ProfileDialog open={open} onOpenChange={onOpenChange} title="Edit profile" description="Update your public creator profile.">
      <div className="max-h-[68vh] overflow-y-auto pr-1">
        <div className="relative h-28 overflow-hidden rounded-xl border border-white/[.07] bg-[#11161d]">
          {coverPreview ? <img src={coverPreview} alt="Cover preview" className="size-full object-cover" /> : <div className="size-full opacity-30 [background-image:radial-gradient(circle_at_center,rgba(139,92,246,.22)_1px,transparent_1px)] [background-size:17px_17px]" />}
          <label className="absolute right-3 top-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/[.1] bg-[#0d1117]/80 px-2.5 py-1.5 text-[9px] text-slate-300 backdrop-blur"><ImagePlus className="size-3.5" /> Cover image<input type="file" accept="image/*" className="sr-only" onChange={(event) => imagePreview(event.target.files?.[0], setCoverPreview)} /></label>
          <div className="absolute -bottom-0 left-4">
            {avatarPreview ? <img src={avatarPreview} alt="Profile preview" className="size-16 rounded-full border-4 border-[#161b22] object-cover" /> : <Avatar initials={creatorProfile.initials} className="size-16 border-4 border-[#161b22] text-base" />}
            <label className="absolute bottom-0 right-0 grid size-6 cursor-pointer place-items-center rounded-full bg-violet-500 text-white"><ImagePlus className="size-3" /><input type="file" accept="image/*" className="sr-only" onChange={(event) => imagePreview(event.target.files?.[0], setAvatarPreview)} /></label>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <EditField label="Display name" value={name} onChange={setName} maxLength={50} />
          <EditField label="Username" value={username} onChange={setUsername} prefix="@" error={!usernameValid ? "Use 3–24 lowercase letters, numbers, _ or -" : undefined} />
          <div className="sm:col-span-2">
            <label className="flex justify-between text-[10px] text-slate-500">Bio <span className={bio.length > 150 ? "text-amber-400" : "text-slate-700"}>{bio.length}/160</span></label>
            <textarea value={bio} onChange={(event) => setBio(event.target.value.slice(0, 160))} rows={3} className="mt-2 w-full resize-none rounded-lg border border-white/[.08] bg-[#0d1117] px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-violet-500/40" />
          </div>
          <EditField label="Location" value={location} onChange={setLocation} />
          <EditField label="Website" value={website} onChange={setWebsite} />
          <EditField label="GitHub" value={github} onChange={setGithub} icon={Github} />
          <EditField label="LinkedIn" value={linkedin} onChange={setLinkedin} icon={Linkedin} />
        </div>

        <ChoiceEditor label="Skills" choices={["Java", "Spring Boot", "Backend", "Microservices", "Prompt Engineering", "Code Review", "System Design"]} selected={skills} onChange={setSkills} />
        <ChoiceEditor label="Preferred models" choices={["GPT-5", "GPT-4.1", "Claude", "Gemini", "DeepSeek", "Grok"]} selected={models} onChange={setModels} />
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-white/[.06] pt-4">
        <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
        <Button onClick={save} disabled={loading || !name.trim() || !usernameValid}>{loading ? <LoaderCircle className="size-4 animate-spin" /> : <Save className="size-4" />}{loading ? "Saving..." : "Save changes"}</Button>
      </div>
    </ProfileDialog>
  );
}

export function ShareProfileDialog({
  open,
  onOpenChange,
  onAction,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (label: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const share = async (method: string) => {
    if (method === "Copy profile link") {
      await navigator.clipboard.writeText("https://prompthub.ai/u/ducnguyen");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    }
    onAction(method === "Copy profile link" ? "Profile link copied" : `${method} selected`);
  };
  const options = [
    { label: "Copy profile link", icon: copied ? Check : Copy },
    { label: "Share to X", icon: X },
    { label: "Share to LinkedIn", icon: Linkedin },
    { label: "Share by email", icon: Mail },
  ];
  return (
    <ProfileDialog open={open} onOpenChange={onOpenChange} title="Share profile" description="Share this creator profile with your network.">
      <div className="space-y-2">
        {options.map((option) => { const Icon = option.icon; return <button type="button" key={option.label} onClick={() => share(option.label)} className="flex h-12 w-full items-center rounded-xl border border-white/[.07] bg-white/[.02] px-3.5 text-left text-xs text-slate-300 transition hover:border-violet-500/20"><span className="grid size-8 place-items-center rounded-lg bg-violet-500/[.07] text-violet-300"><Icon className="size-4" /></span><span className="ml-3">{option.label === "Copy profile link" && copied ? "Link copied" : option.label}</span><Share2 className="ml-auto size-3.5 text-slate-700" /></button>; })}
      </div>
    </ProfileDialog>
  );
}

function ChoiceEditor({ label, choices, selected, onChange }: { label: string; choices: string[]; selected: string[]; onChange: (items: string[]) => void }) {
  return <div className="mt-5"><p className="text-[10px] text-slate-500">{label}</p><div className="mt-2 flex flex-wrap gap-1.5">{choices.map((choice) => { const active = selected.includes(choice); return <button type="button" key={choice} onClick={() => onChange(active ? selected.filter((item) => item !== choice) : [...selected, choice])} className={cn("rounded-md border px-2.5 py-1.5 text-[9px] transition", active ? "border-violet-500/30 bg-violet-500/[.08] text-violet-300" : "border-white/[.07] text-slate-600")}>{active && <Check className="mr-1 inline size-2.5" />}{choice}</button>; })}</div></div>;
}

function EditField({ label, value, onChange, prefix, maxLength, error, icon: Icon }: { label: string; value: string; onChange: (value: string) => void; prefix?: string; maxLength?: number; error?: string; icon?: typeof Github }) {
  return <div><label className="text-[10px] text-slate-500">{label}</label><div className="relative mt-2">{prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-700">{prefix}</span>}{Icon && <Icon className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-700" />}<input value={value} maxLength={maxLength} onChange={(event) => onChange(event.target.value)} className={cn("h-10 w-full rounded-lg border bg-[#0d1117] px-3 text-xs text-slate-200 outline-none focus:border-violet-500/40", error ? "border-red-500/35" : "border-white/[.08]", (prefix || Icon) && "pl-8")} /></div>{error && <p className="mt-1 text-[8px] text-red-400">{error}</p>}</div>;
}

function ProfileDialog({ open, onOpenChange, title, description, children }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; description: string; children: React.ReactNode }) {
  const id = `${title.toLowerCase().replace(/\s+/g, "-")}-description`;
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>{open && <Dialog.Portal forceMount><Dialog.Overlay asChild><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" /></Dialog.Overlay><Dialog.Content asChild aria-describedby={id}><motion.div initial={{ opacity: 0, y: 14, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .98 }} className="fixed left-1/2 top-1/2 z-[90] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/[.1] bg-[#161b22] p-6 shadow-2xl outline-none"><div className="flex items-start justify-between"><div><Dialog.Title className="text-lg font-semibold text-slate-50">{title}</Dialog.Title><Dialog.Description id={id} className="mt-1.5 text-xs text-slate-500">{description}</Dialog.Description></div><Dialog.Close asChild><Button variant="icon" size="icon" className="-mr-2 -mt-2 size-8"><X className="size-4" /></Button></Dialog.Close></div><div className="mt-5">{children}</div></motion.div></Dialog.Content></Dialog.Portal>}</AnimatePresence>
    </Dialog.Root>
  );
}
