#!/usr/bin/env node
/**
 * Fast connection check before prisma db push / seed — short retries, actionable errors.
 */
import { waitForDatabase, printDbUnreachableAndExit } from "./pg-connection.mjs";

try {
  await waitForDatabase({ maxAttempts: 5, intervalMs: 1500, silent: true });
} catch (err) {
  printDbUnreachableAndExit(err);
}
