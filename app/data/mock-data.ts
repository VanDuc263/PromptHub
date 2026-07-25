import {
  BookOpen,
  Boxes,
  Compass,
  FileText,
  Heart,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import type {
  Activity,
  Prompt,
  QuickAction,
  Statistic,
  TrendingPrompt,
  LibraryPrompt,
  PromptVariable,
} from "@/types";

export const quickActions: QuickAction[] = [
  {
    title: "Create prompt",
    description: "Build a reusable prompt with variables and version history.",
    icon: Plus,
    action: "Create",
  },
  {
    title: "Explore community",
    description: "Discover high-quality prompts shared by other creators.",
    icon: Compass,
    action: "Explore",
  },
  {
    title: "Create collection",
    description: "Organize your prompts into focused, shareable collections.",
    icon: Boxes,
    action: "Organize",
  },
];

export const statistics: Statistic[] = [
  { title: "Total prompts", value: "124", change: "12% this month", positive: true, icon: FileText },
  { title: "Public prompts", value: "26", change: "4 new this month", positive: true, icon: Users },
  { title: "Favorites", value: "58", change: "8% this month", positive: true, icon: Heart },
  { title: "Total uses", value: "2,483", change: "18% this month", positive: true, icon: Sparkles },
];

export const prompts: Prompt[] = [
  {
    id: 1,
    title: "Java Code Reviewer",
    description: "Review Spring Boot code following SOLID and Clean Code principles.",
    tags: ["Java", "Spring Boot", "Backend"],
    visibility: "Private",
    version: "v4",
    updatedAt: "2h ago",
    uses: 128,
    favorites: 25,
    accent: "bg-violet-400",
  },
  {
    id: 2,
    title: "SQL Query Optimizer",
    description: "Analyze and optimize PostgreSQL queries for speed and scalability.",
    tags: ["SQL", "PostgreSQL", "Database"],
    visibility: "Team",
    version: "v2",
    updatedAt: "Yesterday",
    uses: 94,
    favorites: 18,
    accent: "bg-sky-400",
  },
  {
    id: 3,
    title: "Backend Interview Coach",
    description: "Run realistic Java backend interviews with actionable feedback.",
    tags: ["Interview", "Java", "Career"],
    visibility: "Public",
    version: "v7",
    updatedAt: "Jul 22",
    uses: 341,
    favorites: 67,
    accent: "bg-emerald-400",
  },
  {
    id: 4,
    title: "TOEIC Vocabulary Generator",
    description: "Generate practical TOEIC vocabulary sets organized by topic.",
    tags: ["English", "TOEIC", "Learning"],
    visibility: "Public",
    version: "v3",
    updatedAt: "Jul 20",
    uses: 215,
    favorites: 42,
    accent: "bg-amber-400",
  },
];

export const trendingPrompts: TrendingPrompt[] = [
  { rank: 1, title: "Senior Code Reviewer", author: "Minh", initials: "MN", category: "Programming", uses: 2400, favorites: 320 },
  { rank: 2, title: "Product Strategy Copilot", author: "An", initials: "AN", category: "Product", uses: 1900, favorites: 284 },
  { rank: 3, title: "UX Research Synthesizer", author: "Linh", initials: "LH", category: "Design", uses: 1700, favorites: 246 },
];

export const activities: Activity[] = [
  { id: 1, actor: "You", action: "updated", target: "Java Code Reviewer", time: "2 hours ago", initials: "VD", tone: "bg-violet-500/15 text-violet-300" },
  { id: 2, actor: "Minh", action: "commented on", target: "SQL Query Optimizer", time: "5 hours ago", initials: "MN", tone: "bg-sky-500/15 text-sky-300" },
  { id: 3, actor: "Lan", action: "forked", target: "TOEIC Vocabulary Generator", time: "Yesterday", initials: "LN", tone: "bg-emerald-500/15 text-emerald-300" },
  { id: 4, actor: "You", action: "saved", target: "Product Strategy Copilot", time: "2 days ago", initials: "VD", tone: "bg-violet-500/15 text-violet-300" },
];

export const collections = [
  { name: "Development", count: 42, icon: BookOpen },
  { name: "Writing", count: 18, icon: FileText },
];

export const libraryPrompts: LibraryPrompt[] = [
  {
    ...prompts[0],
    category: "Programming",
    status: "Published",
    author: "Van Duc",
  },
  {
    ...prompts[1],
    title: "SQL Optimizer",
    category: "Programming",
    status: "Published",
    author: "Van Duc",
  },
  {
    ...prompts[2],
    title: "Backend Interview",
    visibility: "Private",
    category: "Programming",
    status: "Draft",
    author: "Van Duc",
  },
  {
    ...prompts[3],
    category: "English",
    status: "Published",
    author: "Van Duc",
  },
  {
    id: 5,
    title: "Product Launch Copywriter",
    description: "Create sharp launch messaging across landing pages, email, and social.",
    tags: ["Marketing", "Copywriting", "Launch"],
    visibility: "Public",
    version: "v5",
    updatedAt: "Jul 18",
    uses: 486,
    favorites: 74,
    accent: "bg-rose-400",
    category: "Marketing",
    status: "Published",
    author: "Van Duc",
  },
  {
    id: 6,
    title: "Technical Documentation Writer",
    description: "Turn implementation notes into clear, structured developer documentation.",
    tags: ["Writing", "Developer", "Docs"],
    visibility: "Team",
    version: "v1",
    updatedAt: "Jul 16",
    uses: 72,
    favorites: 11,
    accent: "bg-cyan-400",
    category: "English",
    status: "Draft",
    author: "Van Duc",
  },
];

export const promptCategories = [
  "Programming",
  "Marketing",
  "Writing",
  "Product",
  "Education",
  "Research",
];

export const aiModels = [
  "GPT-5",
  "GPT-4.1",
  "Claude Sonnet 4",
  "Gemini 2.5 Pro",
  "Model agnostic",
];

export const promptLanguages = [
  "English",
  "Vietnamese",
  "Japanese",
  "Spanish",
  "Multilingual",
];

export const suggestedTags = [
  "Code Review",
  "Java",
  "Backend",
  "Clean Code",
  "Engineering",
  "Documentation",
];

export const defaultPromptVariables: PromptVariable[] = [
  {
    id: "variable-role",
    name: "role",
    label: "Reviewer role",
    type: "Text",
    required: true,
    placeholder: "Senior Java engineer",
  },
  {
    id: "variable-source-code",
    name: "source_code",
    label: "Source code",
    type: "Long Text",
    required: true,
    placeholder: "Paste the code to review",
  },
  {
    id: "variable-requirements",
    name: "requirements",
    label: "Requirements",
    type: "Select",
    required: false,
    placeholder: "Choose a review focus",
    options: ["SOLID principles", "Performance", "Security", "Clean Code"],
  },
];

export const initialPromptContent = `Act as a {{role}}.

Review the following source code:

{{source_code}}

Focus the review on {{requirements}}.

Return:
1. A concise summary of the approach
2. Critical issues ordered by severity
3. Concrete code improvements
4. A revised implementation where useful

Be direct, technically precise, and explain the reasoning behind each recommendation.`;
