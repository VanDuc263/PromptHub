import { FileCode2 } from "lucide-react";
import { communityPrompts } from "@/data/explore-data";
import { libraryPrompts } from "@/data/mock-data";
import type { SavedPrompt } from "@/types";

export function savedKeyForTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const communitySavedPrompts: SavedPrompt[] = communityPrompts.map(
  (prompt, index) => ({
    id: savedKeyForTitle(prompt.title),
    title: prompt.title,
    description: prompt.description,
    author: prompt.author,
    authorInitials: prompt.authorInitials,
    category: prompt.category,
    tags: prompt.tags,
    models: prompt.models,
    version: index % 3 === 0 ? "v4" : index % 3 === 1 ? "v3" : "v2",
    rating: prompt.rating,
    copies: prompt.copies,
    forks: Math.max(24, Math.round(prompt.copies * 0.11)),
    updatedAt: prompt.createdAt,
    savedAt: index < 2 ? "Today" : index < 5 ? "3 days ago" : "2 weeks ago",
    savedOrder: index,
    visibility: "Public",
    language: "English",
    icon: prompt.icon,
    accent: prompt.accent,
  }),
);

const privateSavedPrompts: SavedPrompt[] = libraryPrompts.slice(0, 3).map(
  (prompt, index) => ({
    id: savedKeyForTitle(prompt.title),
    title: prompt.title,
    description: prompt.description,
    author: "Van Duc",
    authorInitials: "VD",
    category: prompt.category,
    tags: prompt.tags,
    models: index === 0 ? ["GPT-5", "Claude"] : ["GPT-5", "DeepSeek"],
    version: prompt.version,
    rating: 4.7 + index * 0.1,
    copies: prompt.uses,
    forks: 0,
    updatedAt: prompt.updatedAt,
    savedAt: index === 0 ? "Yesterday" : "1 week ago",
    savedOrder: 20 + index,
    visibility: "Private",
    language: "English",
    icon: FileCode2,
    accent: "bg-violet-500/10 text-violet-300",
  }),
);

export const savedPromptCatalog = [
  ...communitySavedPrompts,
  ...privateSavedPrompts.filter(
    (privatePrompt) =>
      !communitySavedPrompts.some((prompt) => prompt.id === privatePrompt.id),
  ),
];

export const initialSavedPromptIds = [
  "spring-boot-api-generator",
  "senior-code-reviewer",
  "product-strategy-copilot",
  "technical-documentation-writer",
  "ai-image-art-director",
  "backend-interview-simulator",
  "java-code-reviewer",
  "sql-optimizer",
];

export const savedStatistics = [
  { label: "Saved Prompts", value: "48" },
  { label: "Collections", value: "8" },
  { label: "Recently Saved", value: "6" },
  { label: "Most Used", value: "12" },
];
