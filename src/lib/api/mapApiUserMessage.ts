import { ApiError } from "@/lib/api/client";

/** Message utilisateur depuis une erreur réseau / API (texte déjà renvoyé par le serveur). */
export function getApiUserMessage(err: unknown, fallbackMessage: string): string {
  if (err instanceof ApiError && err.status === 0) {
    return fallbackMessage;
  }
  if (err instanceof ApiError && err.message.trim() && err.message !== "NETWORK_ERROR") {
    return err.message;
  }
  if (err instanceof Error && err.message.trim()) {
    return err.message;
  }
  return fallbackMessage;
}

/** Erreurs TanStack Query (pages catalogue, détail, listes). */
export function getQueryErrorDescription(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError && error.status === 0) {
    return t("api.backendUnreachable");
  }
  return getApiUserMessage(error, t("api.loadFailed"));
}

/** Erreurs mutations (formulaires, toasts). */
export function getMutationErrorDescription(error: unknown, t: (key: string) => string): string {
  if (error instanceof ApiError && error.status === 0) {
    return t("api.backendUnreachable");
  }
  return getApiUserMessage(error, t("toast.errorDesc"));
}
