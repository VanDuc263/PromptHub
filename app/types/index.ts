import type { LucideIcon } from "lucide-react";

export type PromptVisibility = "Private" | "Public" | "Team";

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
}

export interface Statistic {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
}

export interface Prompt {
  id: number;
  title: string;
  description: string;
  tags: string[];
  visibility: PromptVisibility;
  version: string;
  updatedAt: string;
  uses: number;
  favorites: number;
  accent: string;
}

export interface TrendingPrompt {
  rank: number;
  title: string;
  author: string;
  initials: string;
  category: string;
  uses: number;
  favorites: number;
}

export interface Activity {
  id: number;
  actor: string;
  action: string;
  target: string;
  time: string;
  initials: string;
  tone: string;
}

export type PromptStatus = "Published" | "Draft";

export interface LibraryPrompt extends Prompt {
  category: "Programming" | "Marketing" | "English";
  status: PromptStatus;
  author: string;
}

export type VariableType = "Text" | "Long Text" | "Number" | "Select";

export interface PromptVariable {
  id: string;
  name: string;
  label: string;
  type: VariableType;
  required: boolean;
  placeholder: string;
  options?: string[];
}

export interface PromptEditorMetadata {
  title: string;
  description: string;
  category: string;
  visibility: "Private" | "Public" | "Workspace";
  model: string;
  language: string;
  tags: string[];
}

export interface PromptDetailVariable {
  name: string;
  label: string;
  type: "Text" | "Long Text" | "Select";
  required: boolean;
  defaultValue: string;
  placeholder: string;
  options?: string[];
}

export interface PromptVersion {
  version: string;
  note: string;
  author: string;
  createdAt: string;
  current?: boolean;
}

export interface PromptDetailActivity {
  id: number;
  actor: string;
  initials: string;
  action: string;
  time: string;
  tone: string;
}

export interface VersionChangeMetric {
  label: string;
  value: string;
  tone: "positive" | "negative" | "neutral";
}

export interface VariableChange {
  name: string;
  type: "Added" | "Removed" | "Modified";
  oldValue?: string;
  newValue?: string;
}

export type DiffLineType = "unchanged" | "added" | "removed" | "modified";

export interface VersionDiffRow {
  oldLine?: string;
  newLine?: string;
  oldType: DiffLineType;
  newType: DiffLineType;
}

export interface VariableComparison {
  name: string;
  oldValue: string;
  newValue: string;
}

export interface MetricComparison {
  label: string;
  oldValue: string;
  newValue: string;
}

export interface ExplorePrompt {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  models: string[];
  author: string;
  authorInitials: string;
  createdAt: string;
  copies: number;
  likes: number;
  bookmarks: number;
  rating: number;
  tokens: number;
  visibility: "Public" | "Unlisted";
  snippet: string;
  variables: string[];
  icon: LucideIcon;
  accent: string;
  featured?: boolean;
}

export interface CommunityCreator {
  name: string;
  initials: string;
  prompts: number;
  saves: number;
  tone: string;
}

export interface PublicPromptVariable {
  name: string;
  description: string;
  defaultValue: string;
  required: boolean;
  example: string;
}

export interface PublicPromptExample {
  id: number;
  title: string;
  input: string;
  output: string;
}

export interface PublicPromptVersion {
  version: string;
  note: string;
  date: string;
  current?: boolean;
}

export interface CommunityComment {
  id: number;
  author: string;
  initials: string;
  rating: number;
  comment: string;
  createdAt: string;
  replies: number;
  likes: number;
  tone: string;
}

export interface ProfilePrompt {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  models: string[];
  version: string;
  rating: number;
  copies: number;
  forks: number;
  bookmarks: number;
  likes: number;
  updatedAt: string;
  featured?: boolean;
  icon: LucideIcon;
  accent: string;
}

export interface ProfileCollection {
  id: number;
  name: string;
  description: string;
  prompts: number;
  followers: number;
  updatedAt: string;
  tags: string[];
  icon: LucideIcon;
  accent: string;
}

export interface ProfileActivity {
  id: number;
  type: "Prompts" | "Collections" | "Reviews" | "Followers" | "Profile";
  description: string;
  related?: string;
  timestamp: string;
  group: "Today" | "Yesterday" | "This Week" | "Earlier";
  icon: LucideIcon;
  tone: string;
}

export interface ProfileAchievement {
  name: string;
  description: string;
  earnedAt: string;
  icon: LucideIcon;
  tone: string;
  locked?: boolean;
}

export interface ProfileReview {
  id: number;
  reviewer: string;
  initials: string;
  rating: number;
  prompt: string;
  text: string;
  date: string;
  helpful: number;
  reply?: string;
  tone: string;
}
