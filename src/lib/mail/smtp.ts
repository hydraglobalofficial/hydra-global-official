import "server-only";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type MailPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export type MailResult =
  | { ok: true; skipped?: false; messageId: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string };

export type SmtpVerifyResult =
  | { ok: true; host: string; port: number; user: string }
  | { ok: false; error: string; host: string | null; port: number; user: string | null };

type MailTransporter = ReturnType<typeof nodemailer.createTransport>;

let cached: MailTransporter | null = null;
let cachedKey = "";

function normalizePass(raw: string | undefined) {
  let pass = raw?.trim() ?? "";
  if (
    (pass.startsWith('"') && pass.endsWith('"')) ||
    (pass.startsWith("'") && pass.endsWith("'"))
  ) {
    pass = pass.slice(1, -1);
  }
  // Next.js dotenv-expand uses $$ → $; undo if still doubled in process.env
  if (pass.includes("$$")) pass = pass.replaceAll("$$", "$");
  if (!pass) return "";
  if (/^your[_-]?mailbox[_-]?password$/i.test(pass)) return "";
  if (/^change.?me/i.test(pass)) return "";
  if (/^<.*>$/.test(pass)) return "";
  return pass;
}

/**
 * Read SMTP password from .env without variable expansion.
 * Next.js expands $NAME in process.env (e.g. pa$sword → broken), which caused SMTP 535
 * while `pnpm mail:test` (dotenv) still worked.
 */
function smtpPassFromDotenvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";
    const text = fs.readFileSync(envPath, "utf8");
    for (const key of ["SMTP_PASS", "SMTP_PASSWORD"]) {
      const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
      if (!match) continue;
      const pass = normalizePass(match[1]);
      if (pass) return pass;
    }
  } catch {
    // Production (Vercel) has no .env file — fall through to process.env
  }
  return "";
}

function smtpPass() {
  // Prefer raw .env so `$` in mailbox passwords survives Next.js dotenv-expand.
  const fromFile = smtpPassFromDotenvFile();
  if (fromFile) return fromFile;
  for (const raw of [process.env.SMTP_PASS, process.env.SMTP_PASSWORD]) {
    const pass = normalizePass(raw);
    if (pass) return pass;
  }
  return "";
}

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      smtpPass() &&
      (process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim()),
  );
}

function buildTransportOptions(): SMTPTransport.Options {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT || 465);
  const secure =
    process.env.SMTP_SECURE === "1" ||
    process.env.SMTP_SECURE === "true" ||
    port === 465;

  const options: SMTPTransport.Options = {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: smtpPass(),
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 25_000,
    tls: {
      // Hostinger uses a valid public cert; keep verification on.
      minVersion: "TLSv1.2",
    },
  };

  if (!secure && (port === 587 || port === 2525)) {
    options.requireTLS = true;
  }

  return options;
}

function transporter() {
  const key = [
    process.env.SMTP_HOST,
    process.env.SMTP_PORT,
    process.env.SMTP_SECURE,
    process.env.SMTP_USER,
    smtpPass(),
  ].join("|");

  if (!cached || cachedKey !== key) {
    cached = nodemailer.createTransport(buildTransportOptions());
    cachedKey = key;
  }
  return cached;
}

function fromAddress() {
  return (
    process.env.SMTP_FROM?.trim() ||
    `"${process.env.SMTP_FROM_NAME?.trim() || "HYDRA"}" <${process.env.SMTP_USER!.trim()}>`
  );
}

function friendlySmtpError(error: unknown) {
  const message = error instanceof Error ? error.message : "SMTP send failed.";
  if (/535|Invalid login|authentication failed|EAUTH/i.test(message)) {
    const mailbox = process.env.SMTP_USER?.trim() || "your mailbox";
    return (
      `Hostinger rejected SMTP login (535) for ${mailbox}. ` +
      "In Hostinger → Mailboxes → ⋮ → App passwords, create an app password, " +
      "set SMTP_PASSWORD=\"…\" in .env, restart, then run: pnpm mail:test"
    );
  }
  if (/ETIMEDOUT|ECONNREFUSED|ESOCKET|ENOTFOUND|Greeting never received/i.test(message)) {
    return (
      `Cannot reach SMTP server (${process.env.SMTP_HOST || "host"}:${process.env.SMTP_PORT || 465}). ` +
      "Check SMTP_HOST / SMTP_PORT, or try SMTP_PORT=587 with SMTP_SECURE=false (STARTTLS)."
    );
  }
  if (/certificate|CERT|TLS|SSL/i.test(message)) {
    return `TLS/SSL error talking to SMTP: ${message}`;
  }
  return message;
}

/**
 * Sends mail via SMTP when env is set.
 * If SMTP_* is missing, returns skipped (never throws) so checkout/admin keep working.
 */
export async function sendMail(payload: MailPayload): Promise<MailResult> {
  if (!smtpConfigured()) {
    console.info("[mail] SMTP not configured — skipped send.", {
      to: payload.to,
      subject: payload.subject,
    });
    return {
      ok: true,
      skipped: true,
      reason: "SMTP_HOST / SMTP_USER / SMTP_PASSWORD / SMTP_FROM not set in env yet.",
    };
  }

  try {
    const info = await transporter().sendMail({
      from: fromAddress(),
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo || process.env.SMTP_REPLY_TO?.trim() || undefined,
    });
    return { ok: true, messageId: info.messageId || "sent" };
  } catch (error) {
    const message = friendlySmtpError(error);
    console.error("[mail]", error instanceof Error ? error.message : message);
    return { ok: false, error: message };
  }
}

/** Live login check against Hostinger (or configured SMTP). */
export async function verifySmtp(): Promise<SmtpVerifyResult> {
  const host = process.env.SMTP_HOST?.trim() || null;
  const user = process.env.SMTP_USER?.trim() || null;
  const port = Number(process.env.SMTP_PORT || 465);

  if (!smtpConfigured()) {
    return {
      ok: false,
      error: "SMTP env incomplete — set SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM.",
      host,
      port,
      user,
    };
  }

  try {
    await transporter().verify();
    return { ok: true, host: host!, port, user: user! };
  } catch (error) {
    return {
      ok: false,
      error: friendlySmtpError(error),
      host,
      port,
      user,
    };
  }
}

/** Env vars present — does NOT prove Hostinger accepts the password. */
export function isSmtpReady() {
  return smtpConfigured();
}

export function smtpConfigStatus() {
  return {
    configured: smtpConfigured(),
    host: process.env.SMTP_HOST?.trim() || null,
    user: process.env.SMTP_USER?.trim() || null,
    from: process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || null,
    port: Number(process.env.SMTP_PORT || 465),
    secure:
      process.env.SMTP_SECURE === "1" ||
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT || 465) === 465,
  };
}
