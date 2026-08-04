export interface MyPromptApi {
  id: string;
  title: string;
  description: string;
  tags: string[];
  visibility: "Private" | "Public" | "Team";
  status: "Published" | "Draft";
  version: string;
  updatedAt: string;
  uses: number;
  saves: number;
  category: string;
  author: string;
}

export async function fetchMyPromptsRequest(accessToken: string) {
  let response: Response;
  try {
    response = await fetch("/api/prompts/mine", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("Your session has expired. Please sign in again.");
    }
    throw new Error(`Could not load your prompts (${response.status}).`);
  }
  return response.json() as Promise<MyPromptApi[]>;
}

export async function updatePromptVisibilityRequest(promptId: string, visibility: "Private" | "Public", accessToken: string) {
  const response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}/visibility`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ visibility }),
  });
  if (!response.ok) {
    let message = `Could not change visibility (${response.status}).`;
    try {
      const body = await response.json() as { detail?: string; message?: string };
      message = body.detail ?? body.message ?? message;
    } catch { /* use fallback */ }
    throw new Error(message);
  }
}
