/** Décode le payload JWT sans vérifier la signature (pour planifier un refresh avant expiration). */
export function getJwtExpiryMs(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const json = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = json.padEnd(json.length + ((4 - (json.length % 4)) % 4), "=");
    const payload = JSON.parse(atob(padded)) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}
