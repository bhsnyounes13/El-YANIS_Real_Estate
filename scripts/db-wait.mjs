#!/usr/bin/env node
/**
 * Waits until PostgreSQL accepts connections (after you start Postgres locally or Docker).
 */
import { waitForDatabase, printDbUnreachableAndExit } from "./pg-connection.mjs";

try {
  await waitForDatabase({
    maxAttempts: 60,
    intervalMs: 2000,
    silent: false,
  });
  console.log("[db:wait] PostgreSQL is ready.");
} catch (err) {
  console.error("[db:wait] Timed out waiting for PostgreSQL.");
  printDbUnreachableAndExit(err);
}
