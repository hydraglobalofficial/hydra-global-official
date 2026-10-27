import "server-only";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { readEnvSecret } from "@/lib/env-secret";

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

function smtpEnv(key: string) {
  return readEnvSecret([key]) || process.env[key]?.trim() || "";
}

function smtpConfig() {
  const host = smtpEnv("SMTP_HOST");
  const user = smtpEnv("SMTP_USER");
  const pass = readEnvSecret(["SMTP_PASS", "SMTP_PASSWORD"]);
  const from = smtpEnv("SMTP_FROM");
  const fromName = smtpEnv("SMTP_FROM_NAME") || "HYDRA";
  const replyTo = smtpEnv("SMTP_REPLY_TO");
  const port = Number(smtpEnv("SMTP_PORT") || process.env.SMTP_PORT || 465);
  const secureFlag = smtpEnv("SMTP_SECURE") || process.env.SMTP_SECURE || "";
  const secure = secureFlag === "1" || secureFlag === "true" || port === 465;

  return {
    host,
    user,
    pass,
    from: from || (user ? `"${fromName}" <${user}>` : ""),
    replyTo,
    port,
    secure,
  };
}

function smtpConfigured() {
  const cfg = smtpConfig();
  return Boolean(cfg.host && cfg.user && cfg.pass && cfg.from);
}

function buildTransportOptions(): SMTPTransport.Options {
  const { host, port, secure, user, pass } = smtpConfig();

  const options: SMTPTransport.Options = {
    host,
    port,
    secure,
    auth: { user, pass },
    authMethod: "LOGIN",
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 25_000,
    tls: {
      minVersion: "TLSv1.2",
    },
  };

  if (!secure && (port === 587 || port === 2525)) {
    options.requireTLS = true;
  }

  return options;
}

function transporter() {
  const { host, port, secure, user, pass } = smtpConfig();
  const key = [host, port, secure, user, pass].join("|");

  if (!cached || cachedKey !== key) {
    cached = nodemailer.createTransport(buildTransportOptions());
    cachedKey = key;
  }
  return cached;
}

function friendlySmtpError(error: unknown) {
  const message = error instanceof Error ? error.message : "SMTP send failed.";
  const { user, host, port } = smtpConfig();
  if (/535|Invalid login|authentication failed|EAUTH/i.test(message)) {
    const mailbox = user || "your mailbox";
    return (
      `Hostinger rejected SMTP login (535) for ${mailbox}. ` +
      "Username must be the exact mailbox from Hostinger → Emails (screenshot: business@…). " +
      "Use that mailbox password or an App password, then set SMTP_PASSWORD=\"…\" and run: pnpm mail:test"
    );
  }
  if (/ETIMEDOUT|ECONNREFUSED|ESOCKET|ENOTFOUND|Greeting never received/i.test(message)) {
    return (
      `Cannot reach SMTP server (${host || "host"}:${port || 465}). ` +
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
      reason: "SMTP_HOST / SMTP_USER / SMTP_PASSWORD not set in env yet.",
    };
  }

  const cfg = smtpConfig();

  try {
    const info = await transporter().sendMail({
      from: cfg.from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo || cfg.replyTo || undefined,
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
  const { host, user, port } = smtpConfig();

  if (!smtpConfigured()) {
    return {
      ok: false,
      error: "SMTP env incomplete — set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD (SMTP_FROM optional).",
      host: host || null,
      port,
      user: user || null,
    };
  }

  try {
    await transporter().verify();
    return { ok: true, host, port, user };
  } catch (error) {
    return {
      ok: false,
      error: friendlySmtpError(error),
      host: host || null,
      port,
      user: user || null,
    };
  }
}

/** Env vars present — does NOT prove Hostinger accepts the password. */
export function isSmtpReady() {
  return smtpConfigured();
}

export function smtpConfigStatus() {
  const cfg = smtpConfig();
  return {
    configured: smtpConfigured(),
    host: cfg.host || null,
    user: cfg.user || null,
    from: cfg.from || null,
    port: cfg.port,
    secure: cfg.secure,
  };
}
