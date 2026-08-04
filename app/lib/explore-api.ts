export interface ExplorePromptApi {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  models: string[];
  author: string;
  authorInitials: string;
  publishedAt: string | null;
  copies: number;
  likes: number;
  saves: number;
  rating: number;
  tokens: number;
  visibility: "Public" | "Unlisted";
  systemMessage: string;
  snippet: string;
  variables: string[];
  featured: boolean;
}

export async function fetchExplorePromptsRequest() {
  let response: Response;
  try {
    response = await fetch("/api/prompts/explore");
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    throw new Error(`Could not load prompts (${response.status}).`);
  }
  return response.json() as Promise<ExplorePromptApi[]>;
}

export async function fetchPromptDetailRequest(promptId: string) {
  let response: Response;
  try {
    response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}`);
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    throw new Error(response.status === 404 ? "This prompt is no longer available." : `Could not load prompt (${response.status}).`);
  }
  return response.json() as Promise<ExplorePromptApi>;
}
