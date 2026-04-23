/**
 * Shared PostgreSQL readiness checks using Prisma (loads DATABASE_URL via dotenv).
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

function formatReachabilityError(err) {
  const detail = err instanceof Error ? err.message : String(err);
  const code =
    err && typeof err === "object" && "code" in err ? String(/** @type {{ code?: string }} */ (err).code) : "";
  return [
    "",
    "PostgreSQL is not running or not accessible on localhost:5432",
    "(or DATABASE_URL points to the wrong host/port/database).",
    "",
    "Steps to fix:",
    "  1. Start PostgreSQL locally (Windows service or your OS install).",
    "     Create database `elyanis` if needed; set DATABASE_URL in `.env` to match user/password/host/port.",
    "  2. Then run: npm run db:wait && npm run db:push && npm run db:seed",
    "       (or: npm run db:setup)",
    "  3. Optional — Docker users: npm run db:setup:docker (see docker-compose.yml).",
    "",
    detail ? `Technical detail: ${detail}` : "",
    code ? `Prisma code: ${code}` : "",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * @param {{ maxAttempts?: number; intervalMs?: number; silent?: boolean }} options
 */
export async function waitForDatabase(options = {}) {
  const maxAttempts = options.maxAttempts ?? 30;
  const intervalMs = options.intervalMs ?? 2000;
  const silent = options.silent ?? false;

  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const prisma = new PrismaClient();
    try {
      await prisma.$connect();
      await prisma.$queryRaw`SELECT 1`;
      await prisma.$disconnect();
      if (!silent && maxAttempts > 4) {
        console.log(`[db] PostgreSQL reachable (attempt ${attempt}/${maxAttempts}).`);
      }
      return;
    } catch (err) {
      lastErr = err;
      await prisma.$disconnect().catch(() => {});
      if (attempt < maxAttempts) {
        if (!silent && attempt === 1) {
          console.info("[db] Waiting for PostgreSQL…");
        }
        await new Promise((r) => setTimeout(r, intervalMs));
      }
    }
  }

  throw lastErr ?? new Error("Could not connect to PostgreSQL.");
}

export function printDbUnreachableAndExit(err) {
  console.error(formatReachabilityError(err));
  process.exit(1);
}

export { formatReachabilityError };
