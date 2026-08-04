import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CalendarDays,
  Copy,
  Eye,
  Globe2,
  Link2,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ActivityTimeline } from "@/components/workspace/activity-timeline";
import { CollectionGrid } from "@/components/workspace/collection-grid";
import { InviteMemberModal, type InviteMemberInput } from "@/components/workspace/invite-member-modal";
import { MemberTable } from "@/components/workspace/member-table";
import { WorkspaceCard } from "@/components/workspace/workspace-card";
import { WorkspaceOverview } from "@/components/workspace/workspace-overview";
import { WorkspaceSettings } from "@/components/workspace/workspace-settings";
import { Button } from "@/components/ui/button";
import {
  initialInvitations,
  type PendingInvitation,
  type WorkspaceActivity,
  type WorkspaceCollection,
  type WorkspaceMember,
  type WorkspaceSummary,
} from "@/data/workspace-data";
import { cn } from "@/lib/utils";
import { fetchWorkspaceActivitiesRequest, fetchWorkspaceCollectionsRequest, fetchWorkspaceDetailRequest, fetchWorkspaceMembersRequest, fetchWorkspacesRequest, type WorkspaceDetailApi } from "@/lib/workspace-api";
import { useAppSelector } from "@/store";

type WorkspaceTab = "Overview" | "Members" | "Collections" | "Settings" | "Activity";

const tabs: WorkspaceTab[] = ["Overview", "Members", "Collections", "Settings", "Activity"];

export function WorkspaceManagementPage({
  onAction,
  onWorkspaceChange,
  initialWorkspaceId = "personal",
}: {
  onAction: (label: string) => void;
  onWorkspaceChange?: (workspaceId: string) => void;
  initialWorkspaceId?: string;
}) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(initialWorkspaceId);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [workspaceDetail, setWorkspaceDetail] = useState<WorkspaceDetailApi | null>(null);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);
  const [workspacesLoading, setWorkspacesLoading] = useState(true);
  const [tab, setTab] = useState<WorkspaceTab>("Overview");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [collections, setCollections] = useState<WorkspaceCollection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionsError, setCollectionsError] = useState<string | null>(null);
  const [activities, setActivities] = useState<WorkspaceActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [memberQuery, setMemberQuery] = useState("");
  const [memberRole, setMemberRole] = useState("All roles");
  const [invitations, setInvitations] = useState<PendingInvitation[]>(initialInvitations);
  const [activityPeriod, setActivityPeriod] = useState("Today");
  const [onlyMine, setOnlyMine] = useState(false);
  const currentWorkspace = workspaces.find((workspace) => workspace.id === currentWorkspaceId) ?? workspaces[0];

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    fetchWorkspacesRequest(accessToken)
      .then((items) => {
        if (!active) return;
        setWorkspaces(items);
        const requested = items.find((item) => item.id === initialWorkspaceId)
          ?? (initialWorkspaceId === "backend" ? items.find((item) => !item.personal) : items.find((item) => item.personal))
          ?? items[0];
        if (requested) {
          setCurrentWorkspaceId(requested.id);
          if (requested.id !== initialWorkspaceId) onWorkspaceChange?.(requested.id);
        }
      })
      .catch((error: unknown) => active && setWorkspaceError(error instanceof Error ? error.message : "Could not load workspaces."))
      .finally(() => active && setWorkspacesLoading(false));
    return () => { active = false; };
  }, [accessToken, initialWorkspaceId, onWorkspaceChange]);

  useEffect(() => {
    if (!accessToken || !workspaces.some((workspace) => workspace.id === currentWorkspaceId)) return;
    let active = true;
    fetchWorkspaceDetailRequest(currentWorkspaceId, accessToken)
      .then((detail) => active && setWorkspaceDetail(detail))
      .catch((error: unknown) => active && setWorkspaceError(error instanceof Error ? error.message : "Could not load workspace details."));
    return () => { active = false; };
  }, [accessToken, currentWorkspaceId, workspaces]);

  useEffect(() => {
    if (!accessToken || !workspaces.some((workspace) => workspace.id === currentWorkspaceId)) return;
    let active = true;
    setActivities([]);
    setActivitiesError(null);
    setActivitiesLoading(true);
    fetchWorkspaceActivitiesRequest(currentWorkspaceId, accessToken)
      .then((items) => active && setActivities(items))
      .catch((error: unknown) => active && setActivitiesError(error instanceof Error ? error.message : "Could not load workspace activity."))
      .finally(() => active && setActivitiesLoading(false));
    return () => { active = false; };
  }, [accessToken, currentWorkspaceId, workspaces]);

  useEffect(() => {
    if (!accessToken || !workspaces.some((workspace) => workspace.id === currentWorkspaceId)) return;
    let active = true;
    setCollections([]);
    setCollectionsError(null);
    setCollectionsLoading(true);
    fetchWorkspaceCollectionsRequest(currentWorkspaceId, accessToken)
      .then((items) => active && setCollections(items))
      .catch((error: unknown) => active && setCollectionsError(error instanceof Error ? error.message : "Could not load workspace collections."))
      .finally(() => active && setCollectionsLoading(false));
    return () => { active = false; };
  }, [accessToken, currentWorkspaceId, workspaces]);

  useEffect(() => {
    if (!accessToken || !workspaces.some((workspace) => workspace.id === currentWorkspaceId)) return;
    let active = true;
    setMembers([]);
    setMembersError(null);
    setMembersLoading(true);
    fetchWorkspaceMembersRequest(currentWorkspaceId, accessToken)
      .then((items) => active && setMembers(items))
      .catch((error: unknown) => active && setMembersError(error instanceof Error ? error.message : "Could not load workspace members."))
      .finally(() => active && setMembersLoading(false));
    return () => { active = false; };
  }, [accessToken, currentWorkspaceId, workspaces]);

  const visibleMembers = useMemo(
    () => members.filter((member) => {
      const matchesQuery = `${member.name} ${member.username ?? ""} ${member.email}`.toLowerCase().includes(memberQuery.trim().toLowerCase());
      return matchesQuery && (memberRole === "All roles" || member.role === memberRole);
    }),
    [memberQuery, memberRole, members],
  );

  const visibleActivities = useMemo(
    () => activities.filter((activity) => {
      const periodMatch = activityPeriod === "This Month"
        ? true
        : activityPeriod === "This Week"
          ? activity.period !== "This Month"
          : activity.period === "Today";
      return periodMatch && (!onlyMine || activity.mine);
    }),
    [activities, activityPeriod, onlyMine],
  );

  const invite = (input: InviteMemberInput) => {
    setInvitations((items) => [{
      id: `invite-${Date.now()}`,
      email: input.email,
      role: input.role,
      sent: "Sent just now",
    }, ...items]);
    onAction(`Invitation sent to ${input.email}`);
  };

  return (
    <>
      <div className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-violet-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Workspace Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Manage your personal workspace, collaborate with teams, invite members and organize prompts securely.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => onAction("Join Workspace opened")}><UserPlus className="size-4" /> Join Workspace</Button>
            <Button onClick={() => onAction("Create Workspace opened")}><Plus className="size-4" /> Create Workspace</Button>
            <HeaderMoreMenu onAction={onAction} />
          </div>
        </header>

        <section className="mt-8" aria-labelledby="workspace-switcher-heading">
          <div className="mb-3 flex items-end justify-between">
            <div><h2 id="workspace-switcher-heading" className="text-sm font-semibold text-slate-100">Your Workspaces</h2><p className="mt-1 text-xs text-slate-600">Switch between your personal and team spaces.</p></div>
            <span className="hidden text-[10px] text-slate-600 sm:block">{workspaces.length} workspaces</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {workspacesLoading && Array.from({ length: 2 }, (_, index) => <div key={index} className="h-44 animate-pulse rounded-xl border border-white/[.07] bg-[#161b22]" />)}
            {workspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                current={workspace.id === currentWorkspaceId}
                onSelect={() => {
                  setWorkspaceDetail(null);
                  setWorkspaceError(null);
                  setCurrentWorkspaceId(workspace.id);
                  onWorkspaceChange?.(workspace.id);
                  onAction(`Switched to ${workspace.name}`);
                }}
              />
            ))}
          </div>
          {workspaceError && <p role="alert" className="mt-3 rounded-lg border border-rose-400/20 bg-rose-500/[.06] px-4 py-3 text-xs text-rose-300">{workspaceError}</p>}
        </section>

        {currentWorkspace && <motion.div key={currentWorkspaceId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="mt-8">
          <WorkspaceOverview overview={workspaceDetail?.overview} />
        </motion.div>}

        {currentWorkspace && <div className="sticky top-[72px] z-20 -mx-4 mt-8 border-y border-white/[.07] bg-[#0d1117]/92 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 xl:-mx-8 xl:px-8">
          <div className="flex gap-6 overflow-x-auto" role="tablist" aria-label="Workspace management sections">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
                className={cn(
                  "relative h-12 shrink-0 px-0.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500/70",
                  tab === item ? "text-slate-100" : "text-slate-600 hover:text-slate-300",
                )}
              >
                {item}
                {item === "Members" && <span className="ml-1 text-[9px] text-slate-700">({members.length || currentWorkspace.members || 0})</span>}
                {tab === item && <motion.span layoutId="workspace-tab-underline" className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-violet-400" transition={{ type: "spring", stiffness: 450, damping: 34 }} />}
              </button>
            ))}
          </div>
        </div>}

        {currentWorkspace && <main className="mt-6 min-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.17 }}>
              {tab === "Overview" && <OverviewTab workspace={currentWorkspace} detail={workspaceDetail} onAction={onAction} />}
              {tab === "Members" && (
                <MemberTable
                  members={visibleMembers}
                  invitations={invitations}
                  query={memberQuery}
                  role={memberRole}
                  loading={membersLoading}
                  error={membersError}
                  onQueryChange={setMemberQuery}
                  onRoleChange={setMemberRole}
                  canInvite
                  onInvite={() => setInviteOpen(true)}
                  onAction={onAction}
                  onCancelInvitation={(id) => {
                    setInvitations((items) => items.filter((item) => item.id !== id));
                    onAction("Invitation cancelled");
                  }}
                />
              )}
              {tab === "Collections" && <CollectionGrid collections={collections} loading={collectionsLoading} error={collectionsError} onCreate={() => onAction("Create Collection opened")} onAction={onAction} />}
              {tab === "Settings" && <WorkspaceSettings onAction={onAction} />}
              {tab === "Activity" && (
                <ActivityTab
                  period={activityPeriod}
                  onlyMine={onlyMine}
                  activities={visibleActivities}
                  loading={activitiesLoading}
                  error={activitiesError}
                  onPeriodChange={setActivityPeriod}
                  onOnlyMineChange={setOnlyMine}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>}
      </div>

      <InviteMemberModal open={inviteOpen} onOpenChange={setInviteOpen} onInvite={invite} />
    </>
  );
}

function OverviewTab({ workspace, detail, onAction }: { workspace: WorkspaceSummary; detail: WorkspaceDetailApi | null; onAction: (label: string) => void }) {
  const createdAt = detail ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(detail.createdAt)) : "Loading…";
  const workspaceUrl = `${window.location.host}/w/${detail?.slug ?? workspace.slug}`;
  return (
    <div className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <section className="rounded-xl border border-white/[.07] bg-[#161b22] p-5">
          <div className="flex items-start justify-between gap-4">
            <div><h2 className="text-sm font-semibold text-slate-100">Workspace Information</h2><p className="mt-1 text-xs text-slate-600">Basic details and access configuration.</p></div>
            <Button variant="secondary" size="sm" onClick={() => onAction("Workspace edit opened")}><Settings className="size-3.5" /> Edit</Button>
          </div>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row">
            <span className="grid size-20 shrink-0 place-items-center rounded-2xl border border-violet-400/20 bg-violet-500/[.08] text-lg font-semibold text-violet-300">{workspace.initials}</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-100">{workspace.name}</h3>
              <p className="mt-2 max-w-xl text-xs leading-5 text-slate-500">{detail?.description ?? workspace.description}</p>
              <div className="mt-5 grid gap-4 border-t border-white/[.06] pt-4 sm:grid-cols-2">
                <InfoRow icon={CalendarDays} label="Created" value={createdAt} />
                <InfoRow icon={Users} label="Owner" value={detail?.ownerName ?? "Loading…"} />
                <InfoRow icon={Link2} label="Workspace URL" value={workspaceUrl} action={<button type="button" onClick={() => { void navigator.clipboard.writeText(`${window.location.origin}/w/${detail?.slug ?? workspace.slug}`); onAction("Workspace URL copied"); }} aria-label="Copy workspace URL"><Copy className="size-3 text-slate-600 hover:text-violet-400" /></button>} />
                <InfoRow icon={LockKeyhole} label="Access" value={detail?.personal ? "Personal" : "Workspace members"} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between"><div><h2 className="text-sm font-semibold text-slate-100">Recent Activity</h2><p className="mt-1 text-xs text-slate-600">Latest changes from your team.</p></div><button type="button" className="text-[10px] font-medium text-violet-400 hover:text-violet-300">View all</button></div>
          <ActivityTimeline activities={detail?.recentActivity ?? []} compact />
        </section>
      </div>
    </div>
  );
}

function ActivityTab({
  period,
  onlyMine,
  activities,
  loading,
  error,
  onPeriodChange,
  onOnlyMineChange,
}: {
  period: string;
  onlyMine: boolean;
  activities: WorkspaceActivity[];
  loading: boolean;
  error: string | null;
  onPeriodChange: (period: string) => void;
  onOnlyMineChange: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><h2 className="text-sm font-semibold text-slate-100">Workspace Activity</h2><p className="mt-1 text-xs text-slate-600">A complete record of collaboration and changes.</p></div>
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border border-white/[.08] bg-[#161b22] p-1">
            {["Today", "This Week", "This Month"].map((item) => <button key={item} type="button" onClick={() => onPeriodChange(item)} className={cn("rounded-md px-3 py-1.5 text-[10px] transition", period === item ? "bg-white/[.07] text-slate-200" : "text-slate-600 hover:text-slate-400")}>{item}</button>)}
          </div>
          <button type="button" role="switch" aria-checked={onlyMine} onClick={() => onOnlyMineChange(!onlyMine)} className={cn("rounded-lg border px-3 text-[10px] font-medium transition", onlyMine ? "border-violet-400/25 bg-violet-500/[.07] text-violet-300" : "border-white/[.08] bg-[#161b22] text-slate-500")}>Only Mine</button>
        </div>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-rose-400/20 bg-rose-500/[.06] px-4 py-3 text-xs text-rose-300">{error}</p>}
      {loading ? <div aria-label="Loading activity" className="space-y-2 rounded-xl border border-white/[.07] bg-[#161b22] p-3">{Array.from({ length: 5 }, (_, index) => <div key={index} className="flex items-center gap-3 p-2"><span className="size-9 animate-pulse rounded-full bg-white/[.05]" /><span className="h-3 w-56 animate-pulse rounded bg-white/[.05]" /></div>)}</div> : <ActivityTimeline activities={activities} />}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, action }: { icon: typeof Globe2; label: string; value: string; action?: React.ReactNode }) {
  return <div className="flex gap-2.5"><Icon className="mt-0.5 size-3.5 shrink-0 text-slate-600" /><div className="min-w-0"><p className="text-[9px] uppercase tracking-wider text-slate-700">{label}</p><div className="mt-1 flex items-center gap-2"><span className="truncate text-[11px] text-slate-400">{value}</span>{action}</div></div></div>;
}

function HeaderMoreMenu({ onAction }: { onAction: (label: string) => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild><Button variant="icon" size="icon" aria-label="More workspace actions"><MoreHorizontal className="size-4" /></Button></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={7} className="dropdown-content w-52 p-1.5">
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Workspace settings opened")}><Settings /> Workspace Settings</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Workspace members exported")}><Users /> Export Members</DropdownMenu.Item>
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Workspace visibility opened")}><Eye /> Manage Visibility</DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-white/[.07]" />
          <DropdownMenu.Item className="dropdown-item" onSelect={() => onAction("Workspace link copied")}><Copy /> Copy Workspace Link</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
