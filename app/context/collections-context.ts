import { createContext } from "react";
import type { PromptCollection } from "@/types";

export interface CollectionsContextValue {
  collections: PromptCollection[];
  status: "idle" | "loading" | "succeeded" | "failed";
  createStatus: "idle" | "loading" | "failed";
  error: string | null;
  reload: () => void;
  createCollection: (collection: Omit<PromptCollection, "id" | "createdAt" | "updatedAt" | "promptIds" | "followers" | "views">) => Promise<string | null>;
  updateCollection: (id: string, patch: Partial<PromptCollection>) => void;
  deleteCollection: (id: string) => void;
  duplicateCollection: (id: string) => string | null;
  addPrompts: (collectionIds: string[], promptIds: string[]) => Promise<boolean>;
  removePrompt: (collectionId: string, promptId: string) => Promise<boolean>;
  toggleFollow: (id: string) => void;
}

export const CollectionsContext = createContext<CollectionsContextValue | null>(null);
