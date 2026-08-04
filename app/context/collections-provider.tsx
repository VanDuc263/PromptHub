import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { CollectionsContext } from "@/context/collections-context";
import { addCollectionPromptsRequest, CollectionsApiError, createCollectionRequest, fetchCollectionsRequest, removeCollectionPromptRequest, type CollectionApi } from "@/lib/collections-api";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutUser } from "@/store/auth-slice";
import type { CollectionVisibility, PromptCollection } from "@/types";

function relativeTime(value: string) {
  const elapsed = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(elapsed) || elapsed < 60_000) return "Just now";
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return days < 30 ? `${days}d ago` : new Date(value).toLocaleDateString();
}

function fromApi(collection: CollectionApi): PromptCollection {
  return {
    ...collection,
    createdAt: new Date(collection.createdAt).toLocaleDateString(),
    updatedAt: relativeTime(collection.updatedAt),
    tags: [],
    color: "emerald",
    allowComments: true,
    allowFollowers: collection.visibility === "Public",
  };
}

function apiVisibility(visibility: CollectionVisibility) {
  if (visibility === "Team") return "WORKSPACE" as const;
  return visibility.toUpperCase() as "PRIVATE" | "PUBLIC";
}

export function CollectionsProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const [collections, setCollections] = useState<PromptCollection[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "succeeded" | "failed">(accessToken ? "loading" : "idle");
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!accessToken) {
      void Promise.resolve().then(() => {
        if (cancelled) return;
        setCollections([]);
        setStatus("idle");
        setError(null);
      });
      return () => { cancelled = true; };
    }
    void fetchCollectionsRequest(accessToken).then((response) => {
      if (cancelled) return;
      setCollections(response.map(fromApi));
      setStatus("succeeded");
      setError(null);
    }).catch((requestError: unknown) => {
      if (cancelled) return;
      if (requestError instanceof CollectionsApiError && requestError.status === 401) void dispatch(logoutUser());
      setStatus("failed");
      setError(requestError instanceof Error ? requestError.message : "Could not load collections.");
    });
    return () => { cancelled = true; };
  }, [accessToken, dispatch, loadVersion]);

  const reload = useCallback(() => {
    setStatus("loading");
    setError(null);
    setLoadVersion((version) => version + 1);
  }, []);

  const value = useMemo(() => ({
    collections,
    status,
    createStatus,
    error,
    reload,
    createCollection: async (input: Omit<PromptCollection, "id" | "createdAt" | "updatedAt" | "promptIds" | "followers" | "views">) => {
      if (!accessToken) {
        setError("Please sign in to create a collection.");
        return null;
      }
      setCreateStatus("loading" as const);
      setError(null);
      try {
        const created = fromApi(await createCollectionRequest({
          name: input.name,
          description: input.description,
          visibility: apiVisibility(input.visibility),
          coverImageUrl: input.coverImageUrl?.startsWith("/collection-covers/") ? input.coverImageUrl : null,
        }, accessToken));
        const collection = {
          ...created,
          tags: input.tags,
          color: input.color,
          allowComments: input.allowComments,
          allowFollowers: input.allowFollowers,
          coverImageUrl: created.coverImageUrl,
          localCoverImageUrl: input.localCoverImageUrl ?? null,
        };
        setCollections((items) => [collection, ...items]);
        setCreateStatus("idle" as const);
        return created.id;
      } catch (requestError) {
        if (requestError instanceof CollectionsApiError && requestError.status === 401) void dispatch(logoutUser());
        setCreateStatus("failed" as const);
        setError(requestError instanceof Error ? requestError.message : "Could not create collection.");
        return null;
      }
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
    addPrompts: async (collectionIds: string[], promptIds: string[]) => {
      if (!accessToken || !collectionIds.length || !promptIds.length) return false;
      setError(null);
      try {
        const updated = await Promise.all(collectionIds.map((collectionId) =>
          addCollectionPromptsRequest(collectionId, promptIds, accessToken)));
        const byId = new Map(updated.map((collection) => [collection.id, collection]));
        setCollections((items) => items.map((item) => {
          const apiCollection = byId.get(item.id);
          return apiCollection ? { ...item, promptIds: apiCollection.promptIds, updatedAt: "Just now" } : item;
        }));
        return true;
      } catch (requestError) {
        if (requestError instanceof CollectionsApiError && requestError.status === 401) void dispatch(logoutUser());
        setError(requestError instanceof Error ? requestError.message : "Could not add prompts to the collection.");
        return false;
      }
    },
    removePrompt: async (collectionId: string, promptId: string) => {
      if (!accessToken) return false;
      setError(null);
      try {
        await removeCollectionPromptRequest(collectionId, promptId, accessToken);
        setCollections((items) => items.map((item) => item.id === collectionId ? { ...item, promptIds: item.promptIds.filter((id) => id !== promptId), updatedAt: "Just now" } : item));
        return true;
      } catch (requestError) {
        if (requestError instanceof CollectionsApiError && requestError.status === 401) void dispatch(logoutUser());
        setError(requestError instanceof Error ? requestError.message : "Could not remove the prompt from the collection.");
        return false;
      }
    },
    toggleFollow: (id: string) =>
      setCollections((items) => items.map((item) => item.id === id ? { ...item, following: !item.following, followers: item.followers + (item.following ? -1 : 1) } : item)),
  }), [accessToken, collections, createStatus, dispatch, error, reload, status]);

  return <CollectionsContext.Provider value={value}>{children}</CollectionsContext.Provider>;
}
