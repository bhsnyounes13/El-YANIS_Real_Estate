import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import * as Sentry from "@sentry/node";
import { HttpError } from "../errors/http-error.js";
import { logger } from "../logger.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      error: err.message,
      ...(err.code ? { code: err.code } : {}),
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({
        error: "Unique constraint violation",
        code: "UNIQUE_VIOLATION",
      });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: "Record not found", code: "NOT_FOUND" });
      return;
    }
    if (err.code === "P2021") {
      res.status(503).json({
        ok: false,
        error: "DATABASE_SCHEMA_NOT_READY",
        message: "Database tables are missing. Run Prisma migrations.",
      });
      return;
    }
  }

  const asText = err instanceof Error ? err.message : String(err);
  if (
    /does not exist in the current database/i.test(asText) &&
    (/table|relation/i.test(asText) || /P2021|public\./i.test(asText))
  ) {
    res.status(503).json({
      ok: false,
      error: "DATABASE_SCHEMA_NOT_READY",
      message: "Database tables are missing. Run Prisma migrations.",
    });
    return;
  }

  logger.error({ err }, "internal_server_error");
  if (process.env.SENTRY_DSN?.trim()) {
    Sentry.captureException(err instanceof Error ? err : new Error(String(err)));
  }
  res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}
