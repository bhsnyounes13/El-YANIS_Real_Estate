/**
 * Avant le démarrage du serveur : applique les migrations (production).
 * Mode urgence seulement : EMERGENCY_DB_PUSH=true exécute `prisma db push` (évite en prod).
 * Ignorer toute exécution : SKIP_DB_MIGRATIONS=true (déploiement sans accès DB au boot).
 */
import "dotenv/config";
import { execSync } from "node:child_process";

const schema = "backend/prisma/schema.prisma";

if (process.env.SKIP_DB_MIGRATIONS === "true") {
  console.log("[ensure-prisma-schema] SKIP_DB_MIGRATIONS=true — migrations ignorées.");
  process.exit(0);
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error("[ensure-prisma-schema] DATABASE_URL manquant — impossible d’appliquer le schéma.");
  process.exit(1);
}

if (process.env.EMERGENCY_DB_PUSH === "true") {
  console.warn(
    "[ensure-prisma-schema] EMERGENCY_DB_PUSH=true — prisma db push (urgence, pas l’équivalent de migrate deploy).",
  );
  try {
    execSync(`npx prisma db push --schema ${schema}`, {
      stdio: "inherit",
      env: process.env,
    });
  } catch {
    process.exit(1);
  }
  process.exit(0);
}

try {
  execSync(`npx prisma migrate deploy --schema ${schema}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch {
  process.exit(1);
}
