import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CollectionsContext } from "@/context/collections-context";
import { initialCollections } from "@/data/collections-data";
import type { PromptCollection } from "@/types";

const storageKey = "prompthub:collections";

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<PromptCollection[]>(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return initialCollections;
      const parsed = JSON.parse(stored) as PromptCollection[];
      return parsed.map((collection) => {
        const currentMock = initialCollections.find((item) => item.id === collection.id);
        return currentMock
          ? {
              ...collection,
              name: currentMock.name,
              description: currentMock.description,
              tags: currentMock.tags,
              followers: currentMock.followers,
              views: currentMock.views,
            }
          : collection;
      });
    } catch {
      return initialCollections;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(collections));
  }, [collections]);

  const value = useMemo(() => ({
    collections,
    createCollection: (input: Omit<PromptCollection, "id" | "createdAt" | "updatedAt" | "promptIds" | "followers" | "views">) => {
      const id = `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${Date.now()}`;
      setCollections((items) => [{ ...input, id, promptIds: [], followers: 0, views: 0, createdAt: "Today", updatedAt: "Just now" }, ...items]);
      return id;
    },
    updateCollection: (id: string, patch: Partial<PromptCollection>) =>
      setCollections((items) => items.map((item) => item.id === id ? { ...item, ...patch, updatedAt: "Just now" } : item)),
    deleteCollection: (id: string) => setCollections((items) => items.filter((item) => item.id !== id)),
    duplicateCollection: (id: string) => {
      const source = collections.find((item) => item.id === id);
      if (!source) return null;
      const copyId = `${source.id}-copy-${Date.now()}`;
      setCollections((items) => [{ ...source, id: copyId, name: `${source.name} Copy`, visibility: "Private" as const, followers: 0, createdAt: "Today", updatedAt: "Just now" }, ...items]);
      return copyId;
    },
    addPrompts: (collectionIds: string[], promptIds: string[]) =>
      setCollections((items) => items.map((item) => collectionIds.includes(item.id) ? { ...item, promptIds: [...new Set([...item.promptIds, ...promptIds])], updatedAt: "Just now" } : item)),
    removePrompt: (collectionId: string, promptId: string) =>
      setCollections((items) => items.map((item) => item.id === collectionId ? { ...item, promptIds: item.promptIds.filter((id) => id !== promptId), updatedAt: "Just now" } : item)),
    toggleFollow: (id: string) =>
      setCollections((items) => items.map((item) => item.id === id ? { ...item, following: !item.following, followers: item.followers + (item.following ? -1 : 1) } : item)),
  }), [collections]);

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}
