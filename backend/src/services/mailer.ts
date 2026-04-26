import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { logger } from "../logger.js";

/** Port par défaut 465 (TLS direct, `secure: true`). 587 = STARTTLS, `secure: false`. */
function smtpPort(): number {
  const raw = process.env.SMTP_PORT?.trim();
  if (!raw) return 465;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 465;
}

let transporter: Transporter | null = null;

function buildTransportOptions() {
  const port = smtpPort();
  return {
    host: process.env.SMTP_HOST?.trim() ?? "",
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER?.trim() ?? "",
      pass: process.env.SMTP_PASS?.trim() ?? "",
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  };
}

/**
 * Toutes les variables d’env attendues pour un envoi (sans destinataire métier).
 * EAUTH / 535 côté fournisseur = identifiants incorrects.
 */
export function isSmtpAuthConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.SMTP_FROM?.trim(),
  );
}

function getOrCreateTransporter(): Transporter | null {
  if (!isSmtpAuthConfigured()) return null;
  if (!transporter) {
    const opts = buildTransportOptions();
    transporter = nodemailer.createTransport(opts);
  }
  return transporter;
}

export type SendMailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
};

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Envoie un e-mail. Lance une erreur si la config est incomplète ou si l’envoi échoue
 * (ne log jamais SMTP_PASS).
 */
export async function sendMail(input: SendMailInput): Promise<void> {
  if (!isSmtpAuthConfigured()) {
    const err = new Error("SMTP_NOT_CONFIGURED");
    (err as Error & { code?: string }).code = "SMTP_NOT_CONFIGURED";
    throw err;
  }
  const to = input.to?.trim() ?? "";
  const subject = input.subject?.trim() ?? "";
  if (!to || !emailRe.test(to)) {
    const err = new Error("Invalid recipient");
    (err as Error & { code?: string }).code = "INVALID_TO";
    throw err;
  }
  if (!subject) {
    const err = new Error("Invalid subject");
    (err as Error & { code?: string }).code = "INVALID_SUBJECT";
    throw err;
  }
  const t = getOrCreateTransporter();
  if (!t) {
    const err = new Error("SMTP_NOT_CONFIGURED");
    (err as Error & { code?: string }).code = "SMTP_NOT_CONFIGURED";
    throw err;
  }
  const from = process.env.SMTP_FROM!.trim();
  await t.sendMail({
    from,
    to,
    subject,
    text: input.text,
    html: input.html,
    replyTo: input.replyTo?.trim() || undefined,
  });
}

export function getSmtpConfigSnapshot() {
  const port = smtpPort();
  return {
    host: process.env.SMTP_HOST?.trim() || "missing",
    port: Number.isNaN(port) ? "missing" : port,
    userExists: Boolean(process.env.SMTP_USER?.trim()),
    passExists: Boolean(process.env.SMTP_PASS?.trim()),
    from: process.env.SMTP_FROM?.trim() || "missing",
    fromExists: Boolean(process.env.SMTP_FROM?.trim()),
    /** TLS direct : port 465. Port 587 = STARTTLS, `secure: false` dans nodemailer. */
    secure: !Number.isNaN(port) && port === 465,
  };
}

function nodemailerErrMeta(err: unknown) {
  const e = err as {
    code?: string;
    command?: string;
    message?: string;
    response?: string;
  };
  return {
    message: e.message ?? String(err),
    code: e.code,
    command: e.command,
    response: e.response,
  };
}

export function logSmtpErrorSafe(err: unknown, context: string): void {
  const m = nodemailerErrMeta(err);
  // eslint-disable-next-line no-console -- debug SMTP (jamais de secret)
  console.error("[SMTP_ERROR]", { context, ...m });
  logger.warn({ err: m, context }, "smtp_error");
}

/**
 * Vérifie la connexion SMTP (appel `verify()`).
 * Retourne un objet sûr pour l’API (pas de mot de passe).
 */
export async function runSmtpVerify(): Promise<
  | { ok: true; smtp: "connected" }
  | { ok: false; error: "SMTP_FAILED"; code?: string; command?: string; message: string; response?: string }
> {
  if (!isSmtpAuthConfigured()) {
    return {
      ok: false,
      error: "SMTP_FAILED",
      message: "Missing SMTP_HOST, SMTP_USER, SMTP_PASS, or SMTP_FROM",
    };
  }
  const t = getOrCreateTransporter();
  if (!t) {
    return { ok: false, error: "SMTP_FAILED", message: "Transporter not available" };
  }
  try {
    await t.verify();
    return { ok: true, smtp: "connected" };
  } catch (err) {
    const m = nodemailerErrMeta(err);
    // eslint-disable-next-line no-console
    console.error("[SMTP_DEBUG_ERROR]", {
      message: m.message,
      code: m.code,
      command: m.command,
      response: m.response,
    });
    return {
      ok: false,
      error: "SMTP_FAILED",
      code: m.code,
      command: m.command,
      message: m.message,
      response: m.response,
    };
  }
}

export function isFormNotificationEnabled(): boolean {
  const notify = process.env.SMTP_NOTIFY_TO?.trim() ?? "";
  return isSmtpAuthConfigured() && Boolean(notify);
}
