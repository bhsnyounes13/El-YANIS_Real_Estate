function required(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

/**
 * Origine publique du site (CORS, cookies). En prod : `FRONTEND_ORIGIN` si défini,
 * sinon sur Railway `https://${RAILWAY_PUBLIC_DOMAIN}` quand un domaine public est généré.
 */
function resolveFrontendOrigin(): string {
  const explicit = process.env.FRONTEND_ORIGIN?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const nodeEnv = process.env.NODE_ENV ?? "development";
  if (nodeEnv !== "production") {
    return "http://localhost:8080";
  }

  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railway) {
    const host = stripTrailingSlash(railway.replace(/^https?:\/\//i, ""));
    return `https://${host}`;
  }

  throw new Error(
    [
      "Missing FRONTEND_ORIGIN in production (required for CORS and cookies).",
      "Set FRONTEND_ORIGIN to your public URL (e.g. https://your-app.up.railway.app),",
      "or add Public Networking → Generate Domain on this Railway service so RAILWAY_PUBLIC_DOMAIN is set.",
    ].join("\n"),
  );
}

export const config = {
  /** Port HTTP Express : `PORT` dans l’environnement, sinon 3000. */
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  /**
   * Origine exacte du frontend (CORS + cookies). En production : une seule URL, jamais `*`.
   * Voir `resolveFrontendOrigin` (Railway : repli sur `RAILWAY_PUBLIC_DOMAIN`).
   */
  frontendOrigin: resolveFrontendOrigin(),
  jwtAccessSecret: () =>
    process.env.NODE_ENV === "test"
      ? "test-access-secret-min-32-chars-long!!"
      : required("JWT_ACCESS_SECRET"),
  /** Durée du JWT d’accès (ex: 15m, 900s) */
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES ?? "15m",
  /** Durée de vie du refresh token (cookie) en jours */
  refreshTokenDays: Number(process.env.JWT_REFRESH_DAYS ?? "7"),
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? "12"),
  cookieName: process.env.REFRESH_COOKIE_NAME ?? "ely_refresh",

  /** Secret Turnstile (serveur). Si défini, les formulaires publics exigent une vérification réussie. */
  turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY?.trim() ?? "",
  /**
   * Activer la vérification Turnstile pour les routes formulaires / auth.
   * Par défaut : true si `TURNSTILE_SECRET_KEY` est défini, sinon false (dev local).
   * Mettre explicitement `false` pour désactiver même avec secret (tests uniquement).
   */
  formsRequireTurnstile:
    process.env.FORMS_REQUIRE_TURNSTILE === "false"
      ? false
      : Boolean(process.env.TURNSTILE_SECRET_KEY?.trim()),

  /**
   * Stockage objet S3-compatible (AWS S3 ou Cloudflare R2).
   * `STORAGE_PUBLIC_URL` = URL publique de base des fichiers (sans slash final), ex. https://cdn.example.com ou bucket R2 public.
   */
  storage: {
    bucket: process.env.STORAGE_BUCKET?.trim() ?? "",
    region:
      process.env.STORAGE_REGION?.trim() ||
      (process.env.STORAGE_ENDPOINT?.trim() ? "auto" : "us-east-1"),
    endpoint: process.env.STORAGE_ENDPOINT?.trim() ?? "",
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID?.trim() ?? "",
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY?.trim() ?? "",
    publicUrl: process.env.STORAGE_PUBLIC_URL?.trim().replace(/\/$/, "") ?? "",
    /** R2 / MinIO : souvent true ; AWS hébergé sans endpoint custom : false */
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE === "true" || Boolean(process.env.STORAGE_ENDPOINT?.trim()),
  },
  /**
   * Stockage fichiers sur disque (développement / petit serveur) — sans S3.
   * Chemin relatif à la racine du dépôt ou absolu. Expose les fichiers sous `/uploads/...`.
   */
  localUploadRoot: process.env.STORAGE_LOCAL_ROOT?.trim() ?? "",
  /** URL de base pour les liens publics (défaut : http://127.0.0.1:PORT). */
  localUploadPublicBase: process.env.STORAGE_LOCAL_PUBLIC_BASE?.trim() ?? "",
};
