import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import type { IncomingMessage, ServerResponse } from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Options as PinoHttpOptions } from "pino-http";
import { config } from "./config.js";
import { logger } from "./logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { globalApiRateLimiter } from "./middleware/global-api-rate-limit.js";
import { securityHeadersMiddleware } from "./middleware/security-headers.middleware.js";
import { authRoutes } from "./routes/auth.routes.js";
import { propertyRoutes } from "./routes/property.routes.js";
import { agentRoutes } from "./routes/agent.routes.js";
import { catalogRoutes } from "./routes/catalog.routes.js";
import { inquiryPublicRoutes } from "./routes/inquiry.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import * as uploadController from "./controllers/upload.controller.js";
import { asyncHandler } from "./middleware/async-handler.js";
import { prisma } from "./prisma.js";
import { getRequiredTableStatus } from "./db/required-tables.js";
import { z } from "zod";
import { requireDebugEmailAccess } from "./middleware/debug-email-access.js";
import {
  isSmtpAuthConfigured,
  logSmtpErrorSafe,
  runSmtpVerify,
  sendMail,
} from "./services/mailer.js";

/** Carte d’exposition (diagnostic / déploiement) — hors secrets. */
const PUBLIC_API_ROUTES: string[] = [
  "GET /api/health",
  "GET /api/debug/db",
  "GET /api/debug/smtp",
  "POST /api/debug/send-test-email",
  "GET /api",
  "GET /health",
  "PUT /api/upload-local/:uploadId",
  "POST /api/auth/register",
  "POST /api/auth/login",
  "POST /api/auth/logout",
  "POST /api/auth/refresh",
  "GET /api/auth/me",
  "GET /api/properties",
  "GET /api/properties/featured",
  "GET /api/properties/:id",
  "POST /api/properties",
  "PATCH /api/properties/:id",
  "DELETE /api/properties/:id",
  "GET /api/agents",
  "GET /api/agents/:id",
  "POST /api/agents",
  "PATCH /api/agents/:id",
  "DELETE /api/agents/:id",
  "GET /api/services",
  "GET /api/services/:id",
  "POST /api/services",
  "PATCH /api/services/:id",
  "DELETE /api/services/:id",
  "POST /api/contact",
  "POST /api/inquiries",
  "GET /api/user/profile",
  "GET /api/admin/users",
  "PATCH /api/admin/users/:id",
  "DELETE /api/admin/users/:id",
  "POST /api/admin/uploads/presign",
  "GET /api/admin/dashboard",
  "GET /api/admin/inquiries",
  "DELETE /api/admin/contact-submissions/:id",
  "DELETE /api/admin/property-inquiries/:id",
];

const require = createRequire(import.meta.url);
const pinoHttp = require("pino-http") as (opts?: PinoHttpOptions) => (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) => void;

export function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.use(securityHeadersMiddleware);
  app.use(
    cors({
      origin: (reqOrigin, callback) => {
        if (!reqOrigin) {
          return callback(null, true);
        }
        if (config.allowedCorsOrigins.includes(reqOrigin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-debug-token"],
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());

  if (config.localUploadRoot.trim()) {
    const uploadRoot = path.resolve(process.cwd(), config.localUploadRoot);
    app.use("/uploads", express.static(uploadRoot, { etag: true, maxAge: "1h" }));
  }
  app.put(
    "/api/upload-local/:uploadId",
    express.raw({ limit: 21 * 1024 * 1024, type: () => true }),
    asyncHandler(uploadController.receiveLocalPropertyImage),
  );

  // Avant le rate limiter global sur `/api` — health : vérifie connexion + tables Prisma requises.
  app.get(
    "/api/health",
    asyncHandler(async (_req, res) => {
      try {
        await prisma.$connect();
        const { ok, missing } = await getRequiredTableStatus(prisma);
        if (!ok) {
          res.status(500).json({
            ok: false,
            error: "DATABASE_SCHEMA_NOT_READY",
            missingTables: missing,
          });
          return;
        }
        res.status(200).json({
          ok: true,
          database: "connected",
          tables: {
            User: true,
            Property: true,
            Agent: true,
          },
        });
        return;
      } catch (e) {
        const err = e instanceof Error ? e.message : String(e);
        res.status(500).json({
          ok: false,
          error: "DATABASE_UNAVAILABLE",
          message: err,
        });
        return;
      }
    }),
  );

  app.get(
    "/api/debug/db",
    asyncHandler(async (_req, res) => {
      const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
      if (!hasDatabaseUrl) {
        res.json({
          ok: true,
          hasDatabaseUrl: false,
          provider: "postgresql",
          schemaReady: false,
          missingTables: ["User", "Property", "Agent"],
        });
        return;
      }
      try {
        await prisma.$connect();
        const { ok, missing } = await getRequiredTableStatus(prisma);
        res.json({
          ok: true,
          hasDatabaseUrl: true,
          provider: "postgresql",
          schemaReady: ok,
          missingTables: ok ? [] : missing,
        });
        return;
      } catch {
        res.json({
          ok: true,
          hasDatabaseUrl: true,
          provider: "postgresql",
          schemaReady: false,
          missingTables: ["User", "Property", "Agent"],
        });
        return;
      }
    }),
  );

  app.get(
    "/api/debug/smtp",
    requireDebugEmailAccess,
    asyncHandler(async (_req, res) => {
      const v = await runSmtpVerify();
      if (v.ok) {
        res.status(200).json({
          ok: true,
          smtp: "connected",
          host: process.env.SMTP_HOST || "missing",
          port: Number(process.env.SMTP_PORT || 0),
          secure: Number(process.env.SMTP_PORT) === 465,
          userExists: Boolean(process.env.SMTP_USER),
          passExists: Boolean(process.env.SMTP_PASS),
          fromExists: Boolean(process.env.SMTP_FROM),
        });
        return;
      }
      res.status(500).json({
        ok: false,
        error: "SMTP_FAILED",
        code: v.code,
        command: v.command,
        message: v.message,
      });
    }),
  );

  const testEmailBody = z.object({ to: z.string().email() });

  app.post(
    "/api/debug/send-test-email",
    requireDebugEmailAccess,
    asyncHandler(async (req, res) => {
      const parsed = testEmailBody.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ ok: false, error: "VALIDATION_ERROR" });
        return;
      }
      if (!isSmtpAuthConfigured()) {
        res.status(503).json({
          ok: false,
          error: "EMAIL_SEND_FAILED",
          message: "Email could not be sent",
        });
        return;
      }
      try {
        await sendMail({
          to: parsed.data.to,
          subject: "EL-YANIS SMTP Test",
          text: "SMTP test from Railway backend succeeded.",
        });
        res.json({ ok: true, message: "Test email sent" });
      } catch (e) {
        logSmtpErrorSafe(e, "debug_send_test");
        res.status(503).json({
          ok: false,
          error: "EMAIL_SEND_FAILED",
          message: "Email could not be sent",
        });
      }
    }),
  );

  app.get("/api", (_req, res) => {
    res.status(200).json({
      ok: true,
      service: "elyanis-backend",
      routes: PUBLIC_API_ROUTES,
    });
  });

  app.use("/api", globalApiRateLimiter);
  app.use(
    pinoHttp({
      logger,
      customLogLevel(
        _req: IncomingMessage,
        res: ServerResponse,
        err?: Error,
      ) {
        if (err) return "error";
        if (res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
    }),
  );

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.use("/api/auth", authRoutes());
  app.use("/api/properties", propertyRoutes());
  app.use("/api/agents", agentRoutes());
  app.use("/api/services", catalogRoutes());
  app.use("/api", inquiryPublicRoutes());
  app.use("/api/admin", adminRoutes());
  app.use("/api/user", userRoutes());

  // Monolithe (Railway, etc.) : servir le build Vite `dist/` après `npm run build:production`.
  const distDir = path.resolve(process.cwd(), "dist");
  const indexHtml = path.join(distDir, "index.html");
  const serveSpa =
    fs.existsSync(indexHtml) &&
    (process.env.SERVE_SPA === "true" ||
      (config.nodeEnv === "production" && process.env.SERVE_SPA !== "false"));
  if (serveSpa) {
    app.use(express.static(distDir, { maxAge: "1h" }));
    app.get("*", (req, res, next) => {
      if (req.method !== "GET" && req.method !== "HEAD") return next();
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.resolve(distDir, "index.html"), (err) => {
        if (err) next(err);
      });
    });
  }

  app.use((req, res) => {
    res.status(404).json({
      ok: false,
      error: "Not found",
      method: req.method,
      path: req.originalUrl,
    });
  });

  app.use(errorHandler);

  return app;
}
