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
