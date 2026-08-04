import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Crown, Mail, MoreHorizontal, Search, Shield, Trash2, UserCog, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MemberRole, PendingInvitation, WorkspaceMember } from "@/data/workspace-data";

const roleStyles: Record<MemberRole, string> = {
  Owner: "border-violet-400/20 bg-violet-500/[.08] text-violet-300",
  Admin: "border-sky-400/20 bg-sky-500/[.08] text-sky-300",
  Editor: "border-emerald-400/20 bg-emerald-500/[.08] text-emerald-300",
  Viewer: "text-slate-400",
};

const statusStyles = {
  Online: "bg-emerald-400",
  Away: "bg-amber-400",
  Offline: "bg-slate-600",
};

export function MemberTable({
  members,
  invitations,
  query,
  role,
  onQueryChange,
  onRoleChange,
  onInvite,
  onAction,
  onCancelInvitation,
  loading = false,
  error,
  canInvite = false,
  readOnly = true,
}: {
  members: WorkspaceMember[];
  invitations: PendingInvitation[];
  query: string;
  role: string;
  onQueryChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onInvite: () => void;
  onAction: (label: string) => void;
  onCancelInvitation: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  canInvite?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-700" />
          <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search members..." className="form-input pl-9" />
        </label>
        <select value={role} onChange={(event) => onRoleChange(event.target.value)} className="form-input sm:w-40">
          <option>All roles</option>
          <option>Owner</option>
          <option>Admin</option>
          <option>Editor</option>
          <option>Viewer</option>
        </select>
        {canInvite && <Button onClick={onInvite}><UserPlus className="size-4" /> Invite Member</Button>}
      </div>

      {error && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-500/[.06] px-4 py-3 text-xs text-rose-300">{error}</p>}
      {loading ? (
        <div aria-label="Loading members" className="overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22]">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex items-center gap-3 border-b border-white/[.055] p-4 last:border-0"><span className="size-9 animate-pulse rounded-full bg-white/[.05]" /><span className="h-3 w-40 animate-pulse rounded bg-white/[.05]" /></div>)}</div>
      ) : !members.length ? (
        <EmptyMembers onInvite={onInvite} canInvite={canInvite} filtered={Boolean(query || role !== "All roles")} />
      ) : (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22] md:block">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-white/[.07] bg-white/[.018]">
                <tr className="text-[9px] uppercase tracking-[.12em] text-slate-600">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  {!readOnly && <th className="w-12 px-4 py-3"><span className="sr-only">Actions</span></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[.055]">
                {members.map((member) => (
                  <tr key={member.id} className="group transition hover:bg-white/[.018]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar initials={member.initials} />
                        <div><p className="text-xs font-medium text-slate-200">{member.name}{member.currentUser && <span className="ml-1.5 text-[9px] font-normal text-violet-400">You</span>}</p><p className="mt-0.5 text-[10px] text-slate-600">{member.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge className={roleStyles[member.role]}>{member.role}</Badge></td>
                    <td className="px-4 py-3"><Status member={member} /></td>
                    <td className="px-4 py-3 text-[11px] text-slate-500">{member.joined}</td>
                    {!readOnly && <td className="px-4 py-3"><MemberActions member={member} onAction={onAction} /></td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 md:hidden">
            {members.map((member) => (
              <article key={member.id} className="rounded-xl border border-white/[.07] bg-[#161b22] p-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={member.initials} />
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-slate-200">{member.name}{member.currentUser && <span className="ml-1.5 text-[9px] font-normal text-violet-400">You</span>}</p><p className="mt-1 truncate text-[10px] text-slate-600">{member.email}</p></div>
                  {!readOnly && <MemberActions member={member} onAction={onAction} />}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/[.06] pt-3">
                  <div className="flex items-center gap-2"><Badge className={roleStyles[member.role]}>{member.role}</Badge><Status member={member} /></div>
                  <span className="text-[10px] text-slate-600">{member.joined}</span>
                </div>
              </article>
            ))}
          </motion.div>
        </>
      )}

      {canInvite && <section>
        <div className="mb-3 flex items-end justify-between">
          <div><h3 className="text-sm font-semibold text-slate-100">Pending Invitations</h3><p className="mt-1 text-xs text-slate-600">Invitations that have not been accepted yet.</p></div>
          <Badge>{invitations.length} pending</Badge>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/[.07] bg-[#161b22]">
          {invitations.length ? invitations.map((invitation) => (
            <div key={invitation.id} className="flex flex-col gap-3 border-b border-white/[.055] p-4 last:border-0 sm:flex-row sm:items-center">
              <span className="grid size-9 place-items-center rounded-full bg-white/[.04]"><Mail className="size-4 text-slate-500" /></span>
              <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-slate-300">{invitation.email}</p><p className="mt-1 text-[10px] text-slate-600">{invitation.sent}</p></div>
              <div className="flex items-center gap-2"><Badge className={roleStyles[invitation.role]}>{invitation.role}</Badge><Badge className="border-amber-400/15 bg-amber-400/[.06] text-amber-300">Pending</Badge></div>
              <div className="flex gap-1 sm:ml-3"><Button variant="ghost" size="sm" onClick={() => onAction(`Invitation resent to ${invitation.email}`)}>Resend</Button><Button variant="ghost" size="sm" className="text-rose-400" onClick={() => onCancelInvitation(invitation.id)}>Cancel</Button></div>
            </div>
          )) : <p className="px-4 py-8 text-center text-xs text-slate-600">No pending invitations.</p>}
        </div>
      </section>}
    </div>
  );
}

function Status({ member }: { member: WorkspaceMember }) {
  return <span className="inline-flex items-center gap-2 text-[11px] text-slate-500" title={member.lastActive ? `Last active ${member.lastActive}` : undefined}><span className={cn("size-1.5 rounded-full", statusStyles[member.status])} />{member.status}{member.lastActive && <span className="hidden text-[9px] text-slate-700 lg:inline">· {member.lastActive}</span>}</span>;
}

function MemberActions({ member, onAction }: { member: WorkspaceMember; onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><Button variant="icon" size="icon" className="size-8" aria-label={`Actions for ${member.name}`}><MoreHorizontal className="size-4" /></Button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={6} className="dropdown-content w-48 p-1.5">
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Edit ${member.name}'s role`)}><UserCog /> Edit Role</DropdownMenu.Item>
          {member.role !== "Owner" && <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Transfer ownership to ${member.name}`)}><Crown /> Transfer Ownership</DropdownMenu.Item>}
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction(`Permissions opened for ${member.name}`)}><Shield /> Permissions</DropdownMenu.Item>
          {member.role !== "Owner" && <><DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" /><DropdownMenu.Item className="dropdown-item text-rose-400" onSelect={() => onAction(`Remove ${member.name}`)}><Trash2 /> Remove</DropdownMenu.Item></>}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function EmptyMembers({ onInvite, canInvite, filtered }: { onInvite: () => void; canInvite: boolean; filtered: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-white/[.08] px-6 py-16 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-violet-500/[.06]"><UserPlus className="size-6 text-violet-400/60" /></div>
      <h3 className="mt-4 text-sm font-semibold text-slate-300">{filtered ? "No matching members" : "No members yet"}</h3>
      <p className="mt-1 text-xs text-slate-600">{filtered ? "Try another search term or role." : "This workspace does not have any members."}</p>
      {canInvite && <Button size="sm" className="mt-5" onClick={onInvite}><UserPlus className="size-4" /> Invite Member</Button>}
    </div>
  );
}
