import type { ActivityKind, MemberRole, MemberStatus, WorkspaceActivity, WorkspaceCollection, WorkspaceMember, WorkspaceRole, WorkspaceSummary } from "@/data/workspace-data";

interface WorkspaceSummaryApi {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  personal: boolean;
  role: WorkspaceRole;
  promptCount: number;
  collectionCount: number;
  memberCount: number;
}

interface WorkspaceActivityApi {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityName: string | null;
  createdAt: string;
  mine: boolean;
  oldValues: string | null;
  newValues: string | null;
}

interface WorkspaceMemberApi {
  id: string;
  userId: string;
  name: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  role: MemberRole;
  joinedAt: string;
  lastActiveAt: string | null;
  currentUser: boolean;
}

interface WorkspaceCollectionApi {
  id: string;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  visibility: "Private" | "Public" | "Workspace";
  promptCount: number;
  ownerInitials: string;
  updatedAt: string;
}

export interface WorkspaceDetailApi {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarUrl: string | null;
  personal: boolean;
  role: WorkspaceRole;
  ownerName: string;
  createdAt: string;
  overview: { members: number; prompts: number; collections: number };
  recentActivity: WorkspaceActivity[];
}

async function request<T>(path: string, accessToken: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, { headers: { Authorization: `Bearer ${accessToken}` } });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    throw new Error(`Could not load workspace data (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function fetchWorkspacesRequest(accessToken: string): Promise<WorkspaceSummary[]> {
  const workspaces = await request<WorkspaceSummaryApi[]>("/api/workspaces", accessToken);
  const tones: WorkspaceSummary["tone"][] = ["violet", "sky", "emerald", "slate"];
  return workspaces.map((workspace, index) => ({
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    personal: workspace.personal,
    avatarUrl: workspace.avatarUrl,
    initials: initials(workspace.name),
    role: workspace.role,
    prompts: workspace.promptCount,
    collections: workspace.collectionCount,
    members: workspace.memberCount,
    description: workspace.description ?? "No workspace description yet.",
    tone: tones[index % tones.length],
  }));
}

export async function fetchWorkspaceDetailRequest(workspaceId: string, accessToken: string): Promise<WorkspaceDetailApi> {
  const detail = await request<Omit<WorkspaceDetailApi, "recentActivity"> & { recentActivity: WorkspaceActivityApi[] }>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}`,
    accessToken,
  );
  return { ...detail, recentActivity: detail.recentActivity.map(toActivity) };
}

export async function fetchWorkspaceMembersRequest(workspaceId: string, accessToken: string): Promise<WorkspaceMember[]> {
  const members = await request<WorkspaceMemberApi[]>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/members`,
    accessToken,
  );
  return members.map((member) => ({
    id: member.id,
    userId: member.userId,
    name: member.name,
    username: member.username,
    email: member.email,
    avatarUrl: member.avatarUrl,
    initials: initials(member.name),
    role: member.role,
    status: presenceFor(member.lastActiveAt),
    joined: formatDate(member.joinedAt),
    lastActive: member.lastActiveAt ? relativeTime(member.lastActiveAt) : "Never",
    currentUser: member.currentUser,
  }));
}

export async function fetchWorkspaceCollectionsRequest(workspaceId: string, accessToken: string): Promise<WorkspaceCollection[]> {
  const collections = await request<WorkspaceCollectionApi[]>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/collections`,
    accessToken,
  );
  const tones: WorkspaceCollection["tone"][] = ["violet", "sky", "emerald", "amber", "slate", "rose"];
  return collections.map((collection, index) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description ?? "No description yet.",
    coverImageUrl: collection.coverImageUrl,
    prompts: collection.promptCount,
    collaborators: [collection.ownerInitials],
    visibility: collection.visibility,
    updated: relativeTime(collection.updatedAt),
    tone: tones[index % tones.length],
  }));
}

export async function fetchWorkspaceActivitiesRequest(workspaceId: string, accessToken: string): Promise<WorkspaceActivity[]> {
  const activities = await request<WorkspaceActivityApi[]>(
    `/api/workspaces/${encodeURIComponent(workspaceId)}/activities`,
    accessToken,
  );
  return activities.map(toActivity);
}

function toActivity(activity: WorkspaceActivityApi): WorkspaceActivity {
  return {
    id: activity.id,
    actor: activity.actor,
    initials: initials(activity.actor),
    action: activity.action.toLowerCase(),
    target: activity.entityName ?? activity.entityType.toLowerCase().replaceAll("_", " "),
    time: relativeTime(activity.createdAt),
    period: periodFor(activity.createdAt),
    kind: activityKind(activity.entityType, activity.action),
    mine: activity.mine,
    detail: activityDetail(activity.action, activity.oldValues, activity.newValues),
  };
}

function activityDetail(action: string, oldValues: string | null, newValues: string | null) {
  const previous = parseValues(oldValues);
  const next = parseValues(newValues);
  if (action.toUpperCase() === "MEMBER_ROLE_CHANGED" && previous?.role && next?.role) {
    return `${titleCase(previous.role)} → ${titleCase(next.role)}`;
  }
  if (action.toUpperCase() === "PROMPT_PUBLISHED" && previous?.status && next?.status) {
    return `${titleCase(previous.status)} → ${titleCase(next.status)}`;
  }
  return undefined;
}

function parseValues(value: string | null): Record<string, string> | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, string>;
  } catch {
    return null;
  }
}

function titleCase(value: string) {
  const normalized = value.toLowerCase().replaceAll("_", " ");
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function activityKind(entityType: string, action: string): ActivityKind {
  const value = `${entityType} ${action}`.toLowerCase();
  if (value.includes("member")) return "member";
  if (value.includes("collection")) return "collection";
  if (value.includes("comment")) return "comment";
  if (value.includes("version")) return "version";
  if (value.includes("fork")) return "fork";
  if (value.includes("restore")) return "restore";
  if (value.includes("workspace")) return "workspace";
  return "prompt";
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return `${parts[0]?.[0] ?? "W"}${parts.length > 1 ? parts.at(-1)?.[0] ?? "" : ""}`.toUpperCase();
}

function relativeTime(value: string) {
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function presenceFor(value: string | null): MemberStatus {
  if (!value) return "Offline";
  const elapsed = Math.max(0, Date.now() - new Date(value).getTime());
  if (elapsed < 15 * 60_000) return "Online";
  if (elapsed < 24 * 60 * 60_000) return "Away";
  return "Offline";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function periodFor(value: string): WorkspaceActivity["period"] {
  const days = (Date.now() - new Date(value).getTime()) / 86_400_000;
  if (days < 1) return "Today";
  return days < 7 ? "This Week" : "This Month";
}
