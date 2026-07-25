import { createContext } from "react";

export interface SavedPromptsContextValue {
  savedIds: ReadonlySet<string>;
  isSaved: (id: string) => boolean;
  savePrompt: (id: string) => void;
  removeSaved: (id: string) => void;
  toggleSaved: (id: string) => boolean;
  removeMany: (ids: string[]) => void;
}

export const SavedPromptsContext =
  createContext<SavedPromptsContextValue | null>(null);
