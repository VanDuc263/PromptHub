import type { CollectionVisibility } from "@/types";

export interface CollectionApi {
  id: string;
  name: string;
  description: string;
  coverImageUrl: string | null;
  visibility: CollectionVisibility;
  owner: string;
  ownerInitials: string;
  promptIds: string[];
  followers: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCollectionPayload {
  name: string;
  description: string;
  coverImageUrl: string | null;
  visibility: "PRIVATE" | "PUBLIC" | "WORKSPACE";
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class CollectionsApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "CollectionsApiError";
  }
}

async function readError(response: Response) {
  try {
    const body = await response.json() as { message?: string; detail?: string; error?: string };
    return body.detail ?? body.message ?? body.error;
  } catch {
    return undefined;
  }
}

async function request(path: string, accessToken: string, init?: RequestInit) {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    const serverMessage = await readError(response);
    if (response.status === 401) throw new CollectionsApiError("Your session has expired. Please sign in again.", response.status);
    if (response.status === 403) throw new CollectionsApiError(serverMessage ?? "You do not have permission to manage collections.", response.status);
    throw new CollectionsApiError(serverMessage ?? `Collections request failed (${response.status}).`, response.status);
  }
  return response;
}

export async function fetchCollectionsRequest(accessToken: string) {
  return (await request("/api/collections", accessToken)).json() as Promise<CollectionApi[]>;
}

export async function createCollectionRequest(payload: CreateCollectionPayload, accessToken: string) {
  return (await request("/api/collections", accessToken, {
    method: "POST",
    body: JSON.stringify(payload),
  })).json() as Promise<CollectionApi>;
}

export async function addCollectionPromptsRequest(collectionId: string, promptIds: string[], accessToken: string) {
  return (await request(`/api/collections/${encodeURIComponent(collectionId)}/prompts`, accessToken, {
    method: "POST",
    body: JSON.stringify({ promptIds }),
  })).json() as Promise<CollectionApi>;
}

export async function removeCollectionPromptRequest(collectionId: string, promptId: string, accessToken: string) {
  await request(`/api/collections/${encodeURIComponent(collectionId)}/prompts/${encodeURIComponent(promptId)}`, accessToken, {
    method: "DELETE",
  });
}
