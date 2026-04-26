import type { Request, Response, NextFunction } from "express";

/**
 * En production : exige l’en-tête `x-debug-token: $DEBUG_EMAIL_TOKEN`.
 * En développement : autorisé sans jeton.
 */
export function requireDebugEmailAccess(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (process.env.NODE_ENV !== "production") {
    next();
    return;
  }
  const expected = process.env.DEBUG_EMAIL_TOKEN?.trim();
  if (!expected) {
    res.status(403).json({
      ok: false,
      error: "DEBUG_DISABLED",
      message: "Set DEBUG_EMAIL_TOKEN in production to use this route",
    });
    return;
  }
  const got = String(_req.headers["x-debug-token"] ?? "").trim();
  if (got !== expected) {
    res.status(403).json({ ok: false, error: "FORBIDDEN" });
    return;
  }
  next();
}
