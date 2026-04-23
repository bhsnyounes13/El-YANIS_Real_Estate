/**
 * Client HTTP pour l’API catalogue publique et formulaires.
 * Si `VITE_API_URL` est vide, les URLs sont relatives (`/api/...`) — même origine ou proxy Vite.
 */

import { getAccessToken } from "@/lib/auth/accessToken";

export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  return (raw ?? "").trim().replace(/\/$/, "");
}

/** Construit l’URL finale (origine absolue ou chemin relatif). */
export function resolveApiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Distinction « API injoignable » (réseau, backend arrêté, proxy refusé) vs erreur HTTP. */
export async function fetchWithDiagnostics(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (e) {
    if (e instanceof TypeError) {
      throw new ApiError("NETWORK_ERROR", 0, { code: "NETWORK_ERROR", cause: e.message });
    }
    throw e;
  }
}

async function parseJsonResponseBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text) {
    throw new ApiError("Réponse vide de l’API", res.status);
  }
  const trimmed = text.trimStart();
  if (
    trimmed.startsWith("<!") ||
    trimmed.startsWith("<html") ||
    (res.headers.get("content-type") ?? "").toLowerCase().includes("text/html")
  ) {
    throw new ApiError(
      "L’API a renvoyé du HTML au lieu de JSON. Vérifiez que /api/ est bien proxifié vers Node (Nginx/Apache) et non servi par la SPA.",
      502,
      { code: "HTML_INSTEAD_OF_JSON" },
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError("Réponse JSON invalide de l’API", 502, { preview: text.slice(0, 120) });
  }
}

async function readApiError(res: Response): Promise<{ message: string; body: unknown }> {
  const text = await res.text();
  let body: unknown = {};
  if (text) {
    try {
      body = JSON.parse(text) as unknown;
    } catch {
      body = { raw: text };
    }
  }
  const obj = body as { error?: string; message?: string };
  const message = obj.error ?? obj.message ?? `HTTP ${res.status}`;
  return { message, body };
}

async function throwApiError(res: Response): Promise<never> {
  const { message, body } = await readApiError(res);
  throw new ApiError(message || `HTTP ${res.status}`, res.status, body);
}

export async function apiGet<T>(path: string): Promise<T> {
  const url = resolveApiUrl(path);
  const res = await fetchWithDiagnostics(url, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    await throwApiError(res);
  }
  return parseJsonResponseBody<T>(res);
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const url = resolveApiUrl(path);
  const res = await fetchWithDiagnostics(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await throwApiError(res);
  }
  return parseJsonResponseBody<T>(res);
}

async function fetchAuth(path: string, init: RequestInit): Promise<Response> {
  const url = resolveApiUrl(path);
  const token = getAccessToken();
  if (!token) {
    throw new ApiError("Non authentifié : jeton absent", 401);
  }
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  return fetchWithDiagnostics(url, {
    ...init,
    credentials: "include",
    headers,
  });
}

export async function apiGetAuth<T>(path: string): Promise<T> {
  const res = await fetchAuth(path, { method: "GET" });
  if (!res.ok) {
    await throwApiError(res);
  }
  return parseJsonResponseBody<T>(res);
}

export async function apiPostAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchAuth(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await throwApiError(res);
  }
  return parseJsonResponseBody<T>(res);
}

export async function apiPatchAuth<T>(path: string, body: unknown): Promise<T> {
  const res = await fetchAuth(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    await throwApiError(res);
  }
  return parseJsonResponseBody<T>(res);
}

export async function apiDeleteAuth(path: string): Promise<void> {
  const res = await fetchAuth(path, { method: "DELETE" });
  if (res.status === 204) return;
  if (!res.ok) {
    await throwApiError(res);
  }
}
