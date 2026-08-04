export type WorkspaceRole = "Owner" | "Admin" | "Editor" | "Member" | "Viewer";
export type MemberRole = "Owner" | "Admin" | "Editor" | "Viewer";
export type MemberStatus = "Online" | "Offline" | "Away";
export type ActivityKind = "prompt" | "member" | "fork" | "version" | "collection" | "workspace" | "comment" | "restore";

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  personal: boolean;
  avatarUrl?: string | null;
  initials: string;
  role: WorkspaceRole;
  prompts: number;
  collections: number;
  members?: number;
  description: string;
  tone: "violet" | "sky" | "emerald" | "slate";
}

export interface WorkspaceMember {
  id: string;
  userId?: string;
  name: string;
  initials: string;
  email: string;
  username?: string;
  avatarUrl?: string | null;
  role: MemberRole;
  status: MemberStatus;
  joined: string;
  lastActive?: string;
  currentUser?: boolean;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: Exclude<MemberRole, "Owner">;
  sent: string;
}

export interface WorkspaceCollection {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  prompts: number;
  collaborators: string[];
  visibility: "Private" | "Workspace" | "Public";
  updated: string;
  tone: "violet" | "sky" | "emerald" | "amber" | "slate" | "rose";
}

export interface WorkspaceActivity {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  period: "Today" | "This Week" | "This Month";
  kind: ActivityKind;
  mine?: boolean;
  detail?: string;
}

export interface WorkspaceApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
  status: "Active" | "Inactive";
}

export const workspaces: WorkspaceSummary[] = [
  {
    id: "personal",
    name: "Personal",
    slug: "personal",
    personal: true,
    initials: "VD",
    role: "Owner",
    prompts: 124,
    collections: 12,
    description: "Your private space for building and organizing prompts.",
    tone: "violet",
  },
  {
    id: "backend",
    name: "Backend Team",
    slug: "backend-team",
    personal: false,
    initials: "BT",
    role: "Admin",
    prompts: 48,
    collections: 9,
    members: 6,
    description: "Shared backend engineering prompts and team playbooks.",
    tone: "sky",
  },
  {
    id: "research",
    name: "AI Research",
    slug: "ai-research",
    personal: false,
    initials: "AR",
    role: "Member",
    prompts: 58,
    collections: 24,
    members: 12,
    description: "Experiments, papers, evaluations and research workflows.",
    tone: "emerald",
  },
  {
    id: "design",
    name: "Design Team",
    slug: "design-team",
    personal: false,
    initials: "DT",
    role: "Viewer",
    prompts: 14,
    collections: 4,
    members: 8,
    description: "UX writing, research and product design resources.",
    tone: "slate",
  },
];

export const overviewMetrics = [
  { label: "Members", value: "8", description: "Active collaborators", trend: "+2 this month", icon: "members" },
  { label: "Prompts", value: "172", description: "Across this workspace", trend: "+18 this week", icon: "prompts" },
  { label: "Collections", value: "36", description: "Shared and private", trend: "4 updated", icon: "collections" },
  { label: "API Usage", value: "24,580", description: "Total executions", trend: "+12.4%", icon: "usage" },
] as const;

export const workspaceMembers: WorkspaceMember[] = [
  { id: "m1", name: "Van Duc", initials: "VD", email: "vanduc@prompthub.dev", role: "Owner", status: "Online", joined: "Jan 12, 2024" },
  { id: "m2", name: "Minh Tran", initials: "MT", email: "minh@prompthub.dev", role: "Admin", status: "Online", joined: "Feb 8, 2024" },
  { id: "m3", name: "Anna Nguyen", initials: "AN", email: "anna@prompthub.dev", role: "Editor", status: "Away", joined: "Mar 21, 2024" },
  { id: "m4", name: "Linh Pham", initials: "LP", email: "linh@prompthub.dev", role: "Editor", status: "Online", joined: "Apr 5, 2024" },
  { id: "m5", name: "Daniel Kim", initials: "DK", email: "daniel@prompthub.dev", role: "Viewer", status: "Offline", joined: "May 17, 2024" },
  { id: "m6", name: "Sofia Lee", initials: "SL", email: "sofia@prompthub.dev", role: "Editor", status: "Offline", joined: "Jun 2, 2024" },
  { id: "m7", name: "Alex Morgan", initials: "AM", email: "alex@prompthub.dev", role: "Viewer", status: "Away", joined: "Jun 19, 2024" },
  { id: "m8", name: "Mai Hoang", initials: "MH", email: "mai@prompthub.dev", role: "Viewer", status: "Online", joined: "Jul 1, 2024" },
];

export const initialInvitations: PendingInvitation[] = [
  { id: "i1", email: "john@gmail.com", role: "Editor", sent: "Sent yesterday" },
  { id: "i2", email: "nora@example.com", role: "Viewer", sent: "Sent 3 days ago" },
];

export const workspaceCollections: WorkspaceCollection[] = [
  { id: "c1", name: "Prompt Engineering", description: "Core techniques, reusable patterns and evaluation prompts.", prompts: 18, collaborators: ["VD", "MT", "AN"], visibility: "Workspace", updated: "12 minutes ago", tone: "violet" },
  { id: "c2", name: "Backend Architecture", description: "API design, database reviews and system architecture.", prompts: 24, collaborators: ["MT", "LP"], visibility: "Private", updated: "2 hours ago", tone: "sky" },
  { id: "c3", name: "AI Research Tools", description: "Paper analysis, experiment design and model evaluation.", prompts: 16, collaborators: ["AN", "SL", "VD"], visibility: "Workspace", updated: "Yesterday", tone: "emerald" },
  { id: "c4", name: "Product Writing", description: "Interface copy, release notes and product narratives.", prompts: 11, collaborators: ["MH", "AN"], visibility: "Public", updated: "2 days ago", tone: "amber" },
  { id: "c5", name: "Code Quality", description: "Review checklists, refactoring and test generation.", prompts: 21, collaborators: ["VD", "DK"], visibility: "Workspace", updated: "4 days ago", tone: "slate" },
  { id: "c6", name: "Customer Support", description: "Support workflows and consistent response templates.", prompts: 9, collaborators: ["AM", "MH"], visibility: "Private", updated: "1 week ago", tone: "rose" },
];

export const workspaceActivities: WorkspaceActivity[] = [
  { id: "a1", actor: "Van Duc", initials: "VD", action: "created", target: "Prompt Engineering Guide", time: "8 minutes ago", period: "Today", kind: "prompt", mine: true },
  { id: "a2", actor: "Minh Tran", initials: "MT", action: "invited", target: "Linh Pham", time: "42 minutes ago", period: "Today", kind: "member" },
  { id: "a3", actor: "Anna Nguyen", initials: "AN", action: "forked", target: "SQL Optimizer", time: "2 hours ago", period: "Today", kind: "fork" },
  { id: "a4", actor: "Van Duc", initials: "VD", action: "published", target: "Version 2.3", time: "4 hours ago", period: "Today", kind: "version", mine: true },
  { id: "a5", actor: "Linh Pham", initials: "LP", action: "created collection", target: "AI Tools", time: "Yesterday", period: "This Week", kind: "collection" },
  { id: "a6", actor: "Sofia Lee", initials: "SL", action: "restored a version of", target: "API Documentation Writer", time: "2 days ago", period: "This Week", kind: "restore" },
  { id: "a7", actor: "Daniel Kim", initials: "DK", action: "commented on", target: "React Test Generator", time: "3 days ago", period: "This Week", kind: "comment" },
  { id: "a8", actor: "Van Duc", initials: "VD", action: "renamed the workspace to", target: "Personal", time: "2 weeks ago", period: "This Month", kind: "workspace", mine: true },
];

export const apiKeys: WorkspaceApiKey[] = [
  { id: "k1", name: "Production API", prefix: "ph_live_••••8K2P", created: "May 12, 2024", lastUsed: "4 minutes ago", status: "Active" },
  { id: "k2", name: "Local Development", prefix: "ph_test_••••2Q9M", created: "Jun 3, 2024", lastUsed: "Yesterday", status: "Active" },
  { id: "k3", name: "Legacy Integration", prefix: "ph_live_••••7W1A", created: "Feb 18, 2024", lastUsed: "45 days ago", status: "Inactive" },
];

export const analyticsSeries = {
  creations: [18, 27, 22, 39, 34, 46, 42, 58, 51, 64, 72, 68],
  executions: [31, 42, 38, 56, 49, 68, 61, 78, 74, 88, 82, 96],
  members: [28, 34, 31, 46, 43, 52, 49, 63, 58, 70, 67, 76],
};
