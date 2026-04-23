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
import { HttpError } from "./errors/http-error.js";
import { authRoutes } from "./routes/auth.routes.js";
import { propertyRoutes } from "./routes/property.routes.js";
import { agentRoutes } from "./routes/agent.routes.js";
import { catalogRoutes } from "./routes/catalog.routes.js";
import { inquiryPublicRoutes } from "./routes/inquiry.routes.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import * as uploadController from "./controllers/upload.controller.js";
import { asyncHandler } from "./middleware/async-handler.js";

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
      origin: config.frontendOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
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
    res.json({ ok: true });
  });

  app.use("/api/auth", authRoutes());
  app.use("/api/properties", propertyRoutes());
  app.use("/api/agents", agentRoutes());
  app.use("/api/services", catalogRoutes());
  app.use("/api", inquiryPublicRoutes());
  app.use("/api/admin", adminRoutes());
  app.use("/api/user", userRoutes());

  app.use((_req, _res, next) => {
    next(new HttpError(404, "Not found"));
  });

  app.use(errorHandler);

  return app;
}
