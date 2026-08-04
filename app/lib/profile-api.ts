export interface UserProfileApi {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  websiteUrl: string | null;
  location: string | null;
  verified: boolean;
  joinedAt: string;
  lastActiveAt: string | null;
  publicPromptCount: number;
  publicCollectionCount: number;
  totalCopies: number;
  averageRating: number;
  reviewCount: number;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function fetchProfileRequest(username?: string, accessToken?: string | null) {
  const path = username ? `/api/profiles/${encodeURIComponent(username)}` : "/api/profiles/me";
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
  } catch {
    throw new Error("Could not connect to PromptHub.");
  }
  if (!response.ok) {
    if (response.status === 404) throw new Error("Profile not found.");
    if (response.status === 401 || response.status === 403) throw new Error("Please sign in again to view your profile.");
    throw new Error(`Could not load profile (${response.status}).`);
  }
  return response.json() as Promise<UserProfileApi>;
}
