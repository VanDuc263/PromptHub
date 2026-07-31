import * as Dialog from "@radix-ui/react-dialog";
import { Check, Mail, ShieldCheck, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MemberRole } from "@/data/workspace-data";

export interface InviteMemberInput {
  email: string;
  role: Exclude<MemberRole, "Owner">;
  message: string;
}

const permissionCopy: Record<Exclude<MemberRole, "Owner">, string> = {
  Admin: "Can manage members, workspace settings, prompts and collections.",
  Editor: "Can create, edit and publish prompts and manage collections.",
  Viewer: "Can view workspace prompts and collections without editing.",
};

export function InviteMemberModal({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (input: InviteMemberInput) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Exclude<MemberRole, "Owner">>("Editor");
  const [message, setMessage] = useState("");

  const submit = () => {
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role, message });
    setEmail("");
    setMessage("");
    setRole("Editor");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[110] bg-black/70 backdrop-blur-sm data-[state=open]:animate-[notification-backdrop-in_180ms_ease-out]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[111] max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-white/10 bg-[#161b22] p-6 shadow-[0_28px_90px_rgba(0,0,0,.6)] outline-none data-[state=open]:animate-[dropdown-in_180ms_ease-out]">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl border border-violet-400/15 bg-violet-500/[.08]">
              <UserPlus className="size-5 text-violet-400" />
            </span>
            <div>
              <Dialog.Title className="text-lg font-semibold text-slate-100">Invite Member</Dialog.Title>
              <Dialog.Description className="mt-1 text-xs text-slate-500">Invite someone to collaborate in this workspace.</Dialog.Description>
            </div>
          </div>
          <Dialog.Close className="absolute right-4 top-4 rounded-lg p-2 text-slate-600 outline-none transition hover:bg-white/[.05] hover:text-slate-200 focus-visible:ring-2 focus-visible:ring-violet-500/70">
            <X className="size-4" />
          </Dialog.Close>

          <div className="mt-6 space-y-4">
            <Field label="Email address">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" />
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="member@example.com" className="form-input pl-9" autoFocus />
              </div>
            </Field>
            <Field label="Role">
              <select value={role} onChange={(event) => setRole(event.target.value as Exclude<MemberRole, "Owner">)} className="form-input">
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </Field>
            <Field label="Message (optional)">
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add a short welcome message..." className="min-h-24 w-full resize-none rounded-lg border border-white/10 bg-[#0d1117] px-3 py-2.5 text-xs text-slate-300 outline-none transition placeholder:text-slate-700 focus:border-violet-400/45 focus:ring-2 focus:ring-violet-500/10" />
            </Field>

            <div className="rounded-xl border border-violet-400/15 bg-violet-500/[.045] p-3.5">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                <ShieldCheck className="size-4 text-violet-400" /> Permission summary
              </div>
              <p className="mt-2 text-[11px] leading-5 text-slate-500">{permissionCopy[role]}</p>
              <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-600"><Check className="size-3 text-emerald-400" /> Permissions can be changed later.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button disabled={!email.trim()} onClick={submit}><Mail className="size-4" /> Send Invite</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[10px] font-medium uppercase tracking-[.12em] text-slate-600">{label}</span>{children}</label>;
}
