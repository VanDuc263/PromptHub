import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SavedPromptsContext } from "@/context/saved-prompts-context";
import { initialSavedPromptIds } from "@/data/saved-data";

const storageKey = "prompthub:saved-prompts";

export function SavedPromptsProvider({ children }: { children: ReactNode }) {
  const [savedIdList, setSavedIdList] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? (JSON.parse(saved) as string[]) : initialSavedPromptIds;
    } catch {
      return initialSavedPromptIds;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(savedIdList));
  }, [savedIdList]);

  const value = useMemo(() => {
    const savedIds = new Set(savedIdList);
    return {
      savedIds,
      isSaved: (id: string) => savedIds.has(id),
      savePrompt: (id: string) =>
        setSavedIdList((ids) => (ids.includes(id) ? ids : [id, ...ids])),
      removeSaved: (id: string) =>
        setSavedIdList((ids) => ids.filter((savedId) => savedId !== id)),
      toggleSaved: (id: string) => {
        const willSave = !savedIds.has(id);
        setSavedIdList((ids) =>
          willSave
            ? [id, ...ids]
            : ids.filter((savedId) => savedId !== id),
        );
        return willSave;
      },
      removeMany: (ids: string[]) =>
        setSavedIdList((saved) =>
          saved.filter((savedId) => !ids.includes(savedId)),
        ),
    };
  }, [savedIdList]);

  return (
    <SavedPromptsContext.Provider value={value}>
      {children}
    </SavedPromptsContext.Provider>
  );
}
