/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /**
   * Repli si `VITE_API_URL` est vide : origine pour auth (ex. `https://api.example.com`).
   * Sinon l’auth suit `VITE_API_URL` comme le catalogue.
   */
  readonly VITE_AUTH_API_BASE?: string;
  /** Chemin de base public (ex. `/app/` si l’app est sous un sous-dossier). Laisser vide pour la racine. */
  readonly VITE_BASE_PATH?: string;
  /** Clé publique Cloudflare Turnstile (widget). Vide = pas de widget ; l’API doit alors ne pas exiger Turnstile. */
  readonly VITE_TURNSTILE_SITE_KEY?: string;
  /** DSN Sentry (monitoring frontend). Vide = désactivé. */
  readonly VITE_SENTRY_DSN?: string;
  /** Taux d’échantillonnage des transactions (0–1). Défaut ~0.1 en prod si non défini côté code. */
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
  /** Version / release pour regrouper les événements (aligner sur le déploiement). */
  readonly VITE_SENTRY_RELEASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
