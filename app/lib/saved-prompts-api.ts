export interface SavedPromptApi {
  id: string;
  title: string;
  description: string;
  author: string;
  authorInitials: string;
  category: string;
  tags: string[];
  models: string[];
  version: string;
  rating: number;
  copies: number;
  forks: number;
  updatedAt: string;
  savedAt: string;
  visibility: "Public" | "Private";
  language: string;
}

async function request(path: string, accessToken: string, method = "GET") {
  let response: Response;
  try {
    response = await fetch(path, { method, headers: { Authorization: `Bearer ${accessToken}` } });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Your session has expired. Please sign in again.");
    throw new Error(`Saved prompts request failed (${response.status}).`);
  }
  return response;
}

export async function fetchSavedPromptsRequest(accessToken: string) {
  const response = await request("/api/saved-prompts", accessToken);
  return response.json() as Promise<SavedPromptApi[]>;
}

export async function savePromptRequest(promptId: string, accessToken: string) {
  await request(`/api/saved-prompts/${encodeURIComponent(promptId)}`, accessToken, "POST");
}

export async function removeSavedPromptRequest(promptId: string, accessToken: string) {
  await request(`/api/saved-prompts/${encodeURIComponent(promptId)}`, accessToken, "DELETE");
}
