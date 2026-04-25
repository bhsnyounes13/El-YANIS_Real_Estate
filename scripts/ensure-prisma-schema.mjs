/**
 * Synchronise le schéma Prisma avec la base (idempotent, adapté quand il n’y a pas
 * encore de migrations versionnées). Sauter avec SKIP_DB_PUSH=true.
 * Utilisé par `prestart` pour que le premier déploiement Railway crée les tables.
 */
import "dotenv/config";
import { execSync } from "node:child_process";

if (process.env.SKIP_DB_PUSH === "true") {
  console.log("[ensure-prisma-schema] SKIP_DB_PUSH=true — on saute prisma db push.");
  process.exit(0);
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error("[ensure-prisma-schema] DATABASE_URL manquant — impossible d’appliquer le schéma.");
  process.exit(1);
}

const schema = "backend/prisma/schema.prisma";
try {
  execSync(`npx prisma db push --schema ${schema}`, {
    stdio: "inherit",
    env: process.env,
  });
} catch {
  process.exit(1);
}
