import "dotenv/config";
import "./instrument.js";
import * as Sentry from "@sentry/node";
import { config } from "./config.js";
import { validateStartupEnvironment } from "./env-validation.js";
import { verifyDatabase } from "./bootstrap-db.js";
import { logger } from "./logger.js";
import { prisma } from "./prisma.js";
import { hashPassword } from "./auth/password.js";
import * as userService from "./services/user.service.js";
import { createApp } from "./app.js";

async function bootstrapEnvAdmin(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();
  if (!email || !password) return;
  const existing = await userService.findUserByEmail(email);
  if (existing) return;
  const hash = await hashPassword(password);
  await userService.createUser(email, hash, "admin");
  logger.warn({ email }, "bootstrap_admin_created");
}

async function main() {
  validateStartupEnvironment();

  const app = createApp();
  const host = process.env.HOST?.trim() || "0.0.0.0";

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(config.port, host, () => resolve());
    server.on("error", reject);
  });

  logger.info(
    { host, port: config.port, frontendOrigin: config.frontendOrigin },
    "api_started",
  );

  await verifyDatabase(prisma);
  await bootstrapEnvAdmin();
  logger.info("database_ready");
}

main().catch(async (e) => {
  const err = e instanceof Error ? e : new Error(String(e));
  console.error("\n" + err.message + "\n");
  logger.error({ err: e }, "bootstrap_failed");
  if (process.env.SENTRY_DSN?.trim()) {
    Sentry.captureException(e instanceof Error ? e : new Error(String(e)));
    await Sentry.flush(2000).catch(() => {});
  }
  process.exit(1);
});
