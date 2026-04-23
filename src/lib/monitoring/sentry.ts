import * as Sentry from "@sentry/react";

/** Source maps : activer dans le pipeline (Sentry CLI / plugin Vite) avec `VITE_SENTRY_RELEASE` aligné sur le build. */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();
  if (!dsn) return;

  const tracesRaw = Number(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE ?? "0.1");
  const tracesSampleRate =
    Number.isFinite(tracesRaw) && tracesRaw >= 0 && tracesRaw <= 1 ? tracesRaw : 0.1;

  const tracePropagationTargets: (string | RegExp)[] = ["localhost", /^\//];
  const apiUrl = import.meta.env.VITE_API_URL?.trim();
  if (apiUrl) {
    try {
      tracePropagationTargets.push(new URL(apiUrl).origin);
    } catch {
      /* ignore invalid VITE_API_URL */
    }
  }

  const authBase = import.meta.env.VITE_AUTH_API_BASE?.trim();
  if (authBase) {
    try {
      tracePropagationTargets.push(new URL(authBase).origin);
    } catch {
      /* ignore */
    }
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE?.trim() || undefined,
    integrations: [
      Sentry.browserTracingIntegration({
        tracePropagationTargets,
      }),
    ],
    tracesSampleRate,
    sendDefaultPii: false,
  });
}
