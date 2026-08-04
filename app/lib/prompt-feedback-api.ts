export interface PromptCommentApi {
  id: string;
  parentId: string | null;
  userId: string;
  author: string;
  avatarUrl: string | null;
  content: string;
  edited: boolean;
  mine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptReviewApi {
  id: string;
  userId: string;
  author: string;
  avatarUrl: string | null;
  rating: number;
  content: string | null;
  edited: boolean;
  mine: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromptReviewsApi {
  averageRating: number;
  reviewCount: number;
  currentUserReview: PromptReviewApi | null;
  reviews: PromptReviewApi[];
}

async function request<T>(path: string, accessToken?: string | null, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) throw new Error("Your session has expired.");
    throw new Error(`Feedback request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function fetchPromptCommentsRequest(promptId: string, accessToken?: string | null) {
  return request<PromptCommentApi[]>(`/api/prompts/${encodeURIComponent(promptId)}/comments`, accessToken);
}

export function addPromptCommentRequest(promptId: string, content: string, parentId: string | null, accessToken: string) {
  return request<PromptCommentApi>(`/api/prompts/${encodeURIComponent(promptId)}/comments`, accessToken, {
    method: "POST",
    body: JSON.stringify({ content, parentId }),
  });
}

export function fetchPromptReviewsRequest(promptId: string, accessToken?: string | null) {
  return request<PromptReviewsApi>(`/api/prompts/${encodeURIComponent(promptId)}/reviews`, accessToken);
}

export function upsertPromptReviewRequest(promptId: string, rating: number, content: string, accessToken: string) {
  return request<PromptReviewsApi>(`/api/prompts/${encodeURIComponent(promptId)}/reviews/me`, accessToken, {
    method: "PUT",
    body: JSON.stringify({ rating, content }),
  });
}
