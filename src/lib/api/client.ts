/**
 * Client HTTP pour l’API catalogue publique et formulaires.
 *
 * Base d’URL : `import.meta.env.VITE_API_URL` (build), repli : balise **meta** `elyanis-api-base`, puis
 * `window.__ELYANIS_API_BASE__` (injection dans `dist/index.html` au build), puis hôte connu (elyanis.com).
 * Si vide : requêtes **relatives** `/api/...` (même origine ou proxy dev).
 *
 * @example
 * // .env / CI : VITE_API_URL=https://api.example.com
 * // apiGet("/api/properties") → fetch("https://api.example.com/api/properties")
 * //
 * // Sans variable : apiGet("/api/properties") → fetch("/api/properties")
 */

import { getAccessToken } from "@/lib/auth/accessToken";

/**
 * Dernier recours si l’`import.meta.env` ou `index.html` n’est pas servi (CDN, vieux `dist/`, CSP).
 * Doit rester aligné sur `.env.production` / variable `VITE_API_URL` de build.
 */
const HOST_API_FALLBACK: Readonly<Record<string, string>> = {
  "elyanis.com": "https://elyanis-backend-standalone-production.up.railway.app",
  "www.elyanis.com": "https://elyanis-backend-standalone-production.up.railway.app",
};

declare global {
  interface Window {
    /** Injeté au `vite build` si `VITE_API_URL` est dans `.env.production` (repli si le JS minifié n’embarque pas l’import.meta). */
    __ELYANIS_API_BASE__?: string;
  }
}

function normalizeBaseUrl(raw: string | undefined | null): string {
  return (raw ?? "").trim().replace(/\/$/, "");
}

/** Retourne la valeur normalisée de `import.meta.env.VITE_API_URL` (sans `/` final), ou `""`. */
export function getApiBase(): string {
  const fromEnv = normalizeBaseUrl(import.meta.env.VITE_API_URL as string | undefined);
  if (fromEnv) return fromEnv;

  if (import.meta.env.PROD && typeof document !== "undefined") {
    const fromMeta = normalizeBaseUrl(
      document.querySelector('meta[name="elyanis-api-base"]')?.getAttribute("content") ?? undefined,
    );
    if (fromMeta) return fromMeta;
  }

  if (import.meta.env.PROD && typeof window !== "undefined" && window.__ELYANIS_API_BASE__?.trim()) {
    return normalizeBaseUrl(window.__ELYANIS_API_BASE__);
  }

  if (import.meta.env.PROD && typeof location !== "undefined") {
    const byHost = HOST_API_FALLBACK[location.hostname];
    if (byHost) return byHost;
  }

  return "";
}

/** Préfixe `path` avec la base API (`VITE_API_URL`) ou laisse un chemin relatif. */
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
