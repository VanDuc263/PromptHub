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
