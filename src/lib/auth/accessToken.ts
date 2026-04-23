/**
 * Jeton d’accès JWT — stockage **uniquement en mémoire** (pas localStorage).
 */
let accessTokenMemory: string | null = null;

export function setAccessToken(token: string | null): void {
  accessTokenMemory = token;
}

export function getAccessToken(): string | null {
  return accessTokenMemory;
}
