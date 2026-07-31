import * as Dialog from "@radix-ui/react-dialog";
import {
  Check,
  Copy,
  Github,
  KeyRound,
  MessageCircle,
  NotebookText,
  Plus,
  RefreshCcw,
  Save,
  Slack,
  Trash2,
  Upload,
  UserRoundCog,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiKeys as initialApiKeys, type WorkspaceApiKey } from "@/data/workspace-data";
import { cn } from "@/lib/utils";

const permissionLabels = ["Create prompts", "Publish prompts", "Delete prompts", "Manage collections", "Invite members", "Manage versions"];
const visibilityOptions = [
  { value: "Private", description: "Only invited members can access this workspace." },
  { value: "Public", description: "Anyone can discover and view public workspace content." },
  { value: "Invite only", description: "New members must receive a direct invitation." },
  { value: "Anyone with link", description: "People with the link can request access." },
];

export function WorkspaceSettings({ onAction }: { onAction: (label: string) => void }) {
  const [name, setName] = useState("Personal");
  const [description, setDescription] = useState("A focused workspace for building, testing and organizing production-ready prompts.");
  const [url, setUrl] = useState("prompthub.dev/w/personal");
  const [visibility, setVisibility] = useState("Private");
  const [permissions, setPermissions] = useState(() => Object.fromEntries(permissionLabels.map((label, index) => [label, index < 4])));
  const [keys, setKeys] = useState<WorkspaceApiKey[]>(initialApiKeys);
  const [confirmAction, setConfirmAction] = useState<"Rename Workspace" | "Transfer Ownership" | "Delete Workspace" | null>(null);

  const generateKey = () => {
    setKeys((items) => [{
      id: `key-${Date.now()}`,
      name: "New API Key",
      prefix: "ph_live_••••NEW1",
      created: "Just now",
      lastUsed: "Never",
      status: "Active",
    }, ...items]);
    onAction("API key generated");
  };

  return (
    <div className="space-y-5">
      <SettingsSection title="General" description="Update how this workspace appears across PromptHub.">
        <div className="grid gap-4 lg:grid-cols-[112px_minmax(0,1fr)]">
          <div>
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[.12em] text-slate-600">Workspace logo</p>
            <button type="button" onClick={() => onAction("Workspace logo upload opened")} className="group grid size-24 place-items-center rounded-xl border border-dashed border-white/10 bg-[#0d1117]/60 text-violet-300 outline-none transition hover:border-violet-400/30 focus-visible:ring-2 focus-visible:ring-violet-500/70">
              <span className="text-xl font-semibold group-hover:hidden">VD</span>
              <Upload className="hidden size-5 group-hover:block" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workspace name"><input value={name} onChange={(event) => setName(event.target.value)} className="form-input" /></Field>
            <Field label="Workspace URL"><input value={url} onChange={(event) => setUrl(event.target.value)} className="form-input" /></Field>
            <Field label="Description" className="sm:col-span-2"><textarea value={description} onChange={(event) => setDescription(event.target.value)} className="min-h-24 w-full resize-none rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2.5 text-xs text-slate-300 outline-none transition focus:border-violet-400/45 focus:ring-2 focus:ring-violet-500/10" /></Field>
            <div className="sm:col-span-2 flex justify-end"><Button onClick={() => onAction("Workspace settings saved")}><Save className="size-4" /> Save changes</Button></div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Permissions" description="Control workspace visibility and who can request access.">
        <div className="grid gap-2 sm:grid-cols-2">
          {visibilityOptions.map((option) => (
            <button key={option.value} type="button" onClick={() => setVisibility(option.value)} className={cn("rounded-xl border p-3.5 text-left outline-none transition focus-visible:ring-2 focus-visible:ring-violet-500/70", visibility === option.value ? "border-violet-400/30 bg-violet-500/[.055]" : "border-white/[.07] bg-[#0d1117]/35 hover:border-white/[.12]")}>
              <span className="flex items-center justify-between text-xs font-medium text-slate-300">{option.value}{visibility === option.value && <Check className="size-4 text-violet-400" />}</span>
              <span className="mt-1.5 block text-[10px] leading-4 text-slate-600">{option.description}</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      <SettingsSection title="Member Permissions" description="Choose what regular members are allowed to do.">
        <div className="grid gap-2 sm:grid-cols-2">
          {permissionLabels.map((label) => <Toggle key={label} label={label} checked={Boolean(permissions[label])} onChange={(value) => setPermissions((current) => ({ ...current, [label]: value }))} />)}
        </div>
      </SettingsSection>

      <SettingsSection title="API Keys" description="Manage keys used by applications connected to this workspace." action={<Button size="sm" onClick={generateKey}><Plus className="size-4" /> Generate API Key</Button>}>
        <div className="overflow-x-auto rounded-xl border border-white/[.07]">
          <table className="min-w-[720px] w-full text-left">
            <thead className="border-b border-white/[.07] bg-white/[.018]"><tr className="text-[9px] uppercase tracking-[.12em] text-slate-600"><th className="px-4 py-3 font-medium">Key name</th><th className="px-4 py-3 font-medium">Created</th><th className="px-4 py-3 font-medium">Last used</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead>
            <tbody className="divide-y divide-white/[.055]">
              {keys.map((key) => (
                <tr key={key.id}>
                  <td className="px-4 py-3"><p className="text-xs font-medium text-slate-300">{key.name}</p><button type="button" onClick={() => onAction(`${key.name} copied`)} className="mt-1 inline-flex items-center gap-1 text-[9px] text-slate-600 hover:text-slate-400">{key.prefix}<Copy className="size-2.5" /></button></td>
                  <td className="px-4 py-3 text-[10px] text-slate-500">{key.created}</td>
                  <td className="px-4 py-3 text-[10px] text-slate-500">{key.lastUsed}</td>
                  <td className="px-4 py-3"><Badge className={key.status === "Active" ? "border-emerald-400/15 bg-emerald-500/[.06] text-emerald-300" : ""}>{key.status}</Badge></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Button variant="icon" size="icon" className="size-8" aria-label={`Regenerate ${key.name}`} onClick={() => onAction(`${key.name} regenerated`)}><RefreshCcw className="size-3.5" /></Button><Button variant="icon" size="icon" className="size-8 text-rose-400" aria-label={`Delete ${key.name}`} onClick={() => setKeys((items) => items.filter((item) => item.id !== key.id))}><Trash2 className="size-3.5" /></Button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      <SettingsSection title="Integrations" description="Connect the tools your team already uses.">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "GitHub", icon: Github, available: true },
            { name: "Slack", icon: Slack, available: true },
            { name: "Discord", icon: MessageCircle, available: false },
            { name: "Notion", icon: NotebookText, available: false },
          ].map(({ name: integration, icon: Icon, available }) => (
            <article key={integration} className="rounded-xl border border-white/[.07] bg-[#0d1117]/35 p-4">
              <div className="flex items-start justify-between"><span className="grid size-9 place-items-center rounded-lg bg-white/[.045]"><Icon className="size-4 text-slate-400" /></span>{!available && <Badge className="text-[9px]">Coming Soon</Badge>}</div>
              <p className="mt-4 text-xs font-medium text-slate-300">{integration}</p>
              <Button variant="secondary" size="sm" disabled={!available} className="mt-3 w-full" onClick={() => onAction(`${integration} integration opened`)}>{available ? "Connect" : "Unavailable"}</Button>
            </article>
          ))}
        </div>
      </SettingsSection>

      <section className="rounded-xl border border-rose-500/25 bg-rose-500/[.025] p-5">
        <div><h2 className="text-sm font-semibold text-rose-300">Danger Zone</h2><p className="mt-1 text-xs text-slate-600">These actions affect every member and may not be reversible.</p></div>
        <div className="mt-5 divide-y divide-rose-500/10 rounded-xl border border-rose-500/15">
          <DangerRow icon={KeyRound} title="Rename Workspace" description="Change the workspace name and URL." onClick={() => setConfirmAction("Rename Workspace")} />
          <DangerRow icon={UserRoundCog} title="Transfer Ownership" description="Transfer full control to another administrator." onClick={() => setConfirmAction("Transfer Ownership")} />
          <DangerRow icon={Trash2} title="Delete Workspace" description="Permanently remove this workspace and its data." destructive onClick={() => setConfirmAction("Delete Workspace")} />
        </div>
      </section>

      <ConfirmationDialog action={confirmAction} onOpenChange={(open) => !open && setConfirmAction(null)} onConfirm={() => { if (confirmAction) onAction(`${confirmAction} confirmed`); setConfirmAction(null); }} />
    </div>
  );
}

function SettingsSection({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-5"><div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-sm font-semibold text-slate-100">{title}</h2><p className="mt-1 text-xs text-slate-600">{description}</p></div>{action}</div>{children}</section>;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={className}><span className="mb-2 block text-[10px] font-medium uppercase tracking-[.12em] text-slate-600">{label}</span>{children}</label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center justify-between rounded-lg border border-white/[.07] bg-[#0d1117]/35 px-3.5 py-3 text-xs text-slate-400 outline-none transition hover:border-white/[.12] focus-visible:ring-2 focus-visible:ring-violet-500/70"><span>{label}</span><span className={cn("relative h-5 w-9 rounded-full transition", checked ? "bg-violet-500" : "bg-white/10")}><span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition", checked ? "left-[18px]" : "left-0.5")} /></span></button>;
}

function DangerRow({ icon: Icon, title, description, destructive, onClick }: { icon: typeof Trash2; title: string; description: string; destructive?: boolean; onClick: () => void }) {
  return <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"><span className="grid size-9 place-items-center rounded-lg bg-rose-500/[.06]"><Icon className="size-4 text-rose-400/80" /></span><div className="min-w-0 flex-1"><p className="text-xs font-medium text-slate-300">{title}</p><p className="mt-1 text-[10px] text-slate-600">{description}</p></div><Button variant="secondary" size="sm" className={cn(destructive && "border-rose-500/20 text-rose-400 hover:bg-rose-500/[.08]")} onClick={onClick}>{title}</Button></div>;
}

function ConfirmationDialog({ action, onOpenChange, onConfirm }: { action: string | null; onOpenChange: (open: boolean) => void; onConfirm: () => void }) {
  const [confirmation, setConfirmation] = useState("");
  const destructive = action === "Delete Workspace";
  return <Dialog.Root open={Boolean(action)} onOpenChange={(open) => { if (!open) setConfirmation(""); onOpenChange(open); }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-[111] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-2xl outline-none"><Dialog.Title className="text-lg font-semibold text-slate-100">{action}</Dialog.Title><Dialog.Description className="mt-2 text-xs leading-5 text-slate-500">{destructive ? "This permanently deletes the workspace. Type Personal to confirm." : `Confirm that you want to ${action?.toLowerCase()}.`}</Dialog.Description>{destructive && <input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Type Personal" className="form-input mt-5" />}<div className="mt-6 flex justify-end gap-2"><Dialog.Close asChild><Button variant="secondary">Cancel</Button></Dialog.Close><Button disabled={destructive && confirmation !== "Personal"} className={cn(destructive && "bg-rose-500 hover:bg-rose-400")} onClick={onConfirm}>Confirm</Button></div><Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 hover:bg-white/[.05]"><X className="size-4" /></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
