import { fetchWithDiagnostics } from "@/lib/api/client";
import { getAccessToken, setAccessToken } from "./accessToken";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

function authUrl(path: string): string {
  const base = (import.meta.env.VITE_AUTH_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
  return `${base}${path}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function loginRequest(
  email: string,
  password: string,
  turnstileToken?: string,
): Promise<{
  accessToken: string;
  user: AuthUser;
}> {
  const res = await fetchWithDiagnostics(authUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
  });
  const body = await parseJson<{ accessToken?: string; user?: AuthUser; error?: string }>(res);
  if (!res.ok) {
    throw new Error(body.error ?? `Login failed (${res.status})`);
  }
  if (!body.accessToken || !body.user) throw new Error("Invalid login response");
  setAccessToken(body.accessToken);
  return { accessToken: body.accessToken, user: body.user };
}

export async function registerRequest(
  email: string,
  password: string,
  turnstileToken?: string,
): Promise<{
  accessToken: string;
  user: AuthUser;
}> {
  const res = await fetchWithDiagnostics(authUrl("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      ...(turnstileToken ? { turnstileToken } : {}),
    }),
  });
  const body = await parseJson<{ accessToken?: string; user?: AuthUser; error?: string }>(res);
  if (!res.ok) {
    throw new Error(body.error ?? `Register failed (${res.status})`);
  }
  if (!body.accessToken || !body.user) throw new Error("Invalid register response");
  setAccessToken(body.accessToken);
  return { accessToken: body.accessToken, user: body.user };
}

export async function refreshSession(): Promise<{ accessToken: string; user: AuthUser } | null> {
  let res: Response;
  try {
    res = await fetchWithDiagnostics(authUrl("/api/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  } catch {
    setAccessToken(null);
    return null;
  }
  if (!res.ok) {
    setAccessToken(null);
    return null;
  }
  const body = await parseJson<{ accessToken?: string; user?: AuthUser }>(res);
  if (!body.accessToken || !body.user) {
    setAccessToken(null);
    return null;
  }
  setAccessToken(body.accessToken);
  return { accessToken: body.accessToken, user: body.user };
}

export async function logoutRequest(): Promise<void> {
  const token = getAccessToken();
  await fetchWithDiagnostics(authUrl("/api/auth/logout"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  setAccessToken(null);
}

export async function fetchMe(): Promise<AuthUser | null> {
  const token = getAccessToken();
  if (!token) return null;
  let res: Response;
  try {
    res = await fetchWithDiagnostics(authUrl("/api/auth/me"), {
      credentials: "include",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const body = await parseJson<{ user?: AuthUser }>(res);
  return body.user ?? null;
}
