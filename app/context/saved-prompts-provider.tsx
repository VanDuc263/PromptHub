import { useEffect, useMemo, useState, type ReactNode } from "react";
import { SavedPromptsContext } from "@/context/saved-prompts-context";
import { initialSavedPromptIds } from "@/data/saved-data";
import { removeSavedPromptRequest, savePromptRequest } from "@/lib/saved-prompts-api";
import { useAppSelector } from "@/store";

const storageKey = "prompthub:saved-prompts";

export function SavedPromptsProvider({ children }: { children: ReactNode }) {
  const accessToken = useAppSelector((state) => state.auth.accessToken);
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
    const sync = (id: string, shouldSave: boolean) => {
      if (!accessToken || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return;
      const operation = shouldSave ? savePromptRequest(id, accessToken) : removeSavedPromptRequest(id, accessToken);
      void operation.catch(() => {
        setSavedIdList((ids) => shouldSave ? ids.filter((savedId) => savedId !== id) : (ids.includes(id) ? ids : [id, ...ids]));
      });
    };
    return {
      savedIds,
      isSaved: (id: string) => savedIds.has(id),
      savePrompt: (id: string) => {
        setSavedIdList((ids) => (ids.includes(id) ? ids : [id, ...ids]));
        sync(id, true);
      },
      removeSaved: (id: string) => {
        setSavedIdList((ids) => ids.filter((savedId) => savedId !== id));
        sync(id, false);
      },
      toggleSaved: (id: string) => {
        const willSave = !savedIds.has(id);
        setSavedIdList((ids) =>
          willSave
            ? [id, ...ids]
            : ids.filter((savedId) => savedId !== id),
        );
        sync(id, willSave);
        return willSave;
      },
      removeMany: (ids: string[]) => {
        setSavedIdList((saved) =>
          saved.filter((savedId) => !ids.includes(savedId)),
        );
        ids.forEach((id) => sync(id, false));
      },
    };
  }, [accessToken, savedIdList]);

  return (
    <SavedPromptsContext.Provider value={value}>
      {children}
    </SavedPromptsContext.Provider>
  );
}
