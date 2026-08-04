export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
}

export interface StoredSession {
  accessToken: string;
  user: AuthUser;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const sessionKey = "prompthub_auth";

async function readError(response: Response) {
  try {
    const body = (await response.json()) as {
      message?: string;
      detail?: string;
      error?: string;
      errors?: Array<{ defaultMessage?: string }>;
    };
    return body.detail ?? body.message ?? body.errors?.[0]?.defaultMessage ?? body.error
      ?? "Something went wrong. Please try again.";
  } catch {
    return "Cannot connect to PromptHub. Please check the server and try again.";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("Cannot connect to PromptHub. Please check the server and try again.");
  }
  if (!response.ok) throw new Error(await readError(response));
  return response.json() as Promise<T>;
}

export function loginRequest(payload: LoginPayload) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: payload.email.trim(), password: payload.password }),
  });
}

export function registerRequest(payload: RegisterPayload) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...payload, email: payload.email.trim(), fullName: payload.fullName.trim() }),
  });
}

export async function usernameAvailabilityRequest(username: string) {
  const result = await request<{ available: boolean }>(
    `/api/auth/username-available?username=${encodeURIComponent(username)}`,
  );
  return result.available;
}

export function persistSession(session: StoredSession, persistent: boolean) {
  clearSession();
  const storage = persistent ? localStorage : sessionStorage;
  storage.setItem(sessionKey, JSON.stringify(session));
}

export function loadSession(): StoredSession | null {
  const raw = localStorage.getItem(sessionKey) ?? sessionStorage.getItem(sessionKey);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw) as StoredSession;
    const payload = session.accessToken.split(".")[1];
    if (!payload) throw new Error("Invalid access token");
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const claims = JSON.parse(atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="))) as { exp?: number };
    if (!claims.exp || claims.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(sessionKey);
  sessionStorage.removeItem(sessionKey);
  localStorage.removeItem("prompthub_access_token");
  sessionStorage.removeItem("prompthub_access_token");
}
