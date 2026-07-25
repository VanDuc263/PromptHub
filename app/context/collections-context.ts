import { createContext } from "react";
import type { PromptCollection } from "@/types";

export interface CollectionsContextValue {
  collections: PromptCollection[];
  createCollection: (collection: Omit<PromptCollection, "id" | "createdAt" | "updatedAt" | "promptIds" | "followers" | "views">) => string;
  updateCollection: (id: string, patch: Partial<PromptCollection>) => void;
  deleteCollection: (id: string) => void;
  duplicateCollection: (id: string) => string | null;
  addPrompts: (collectionIds: string[], promptIds: string[]) => void;
  removePrompt: (collectionId: string, promptId: string) => void;
  toggleFollow: (id: string) => void;
}

export const CollectionsContext = createContext<CollectionsContextValue | null>(null);
