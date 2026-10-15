import "server-only";
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

function smtpPass() {
  const candidates = [process.env.SMTP_PASS, process.env.SMTP_PASSWORD];
  for (const raw of candidates) {
    const pass = raw?.trim() ?? "";
    if (!pass) continue;
    // Ignore scaffold placeholders left in .env
    if (/^your[_-]?mailbox[_-]?password$/i.test(pass)) continue;
    if (/^change.?me/i.test(pass)) continue;
    return pass;
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

function transporter() {
  const host = process.env.SMTP_HOST!.trim();
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "1" || process.env.SMTP_SECURE === "true" || port === 465;
  const options: SMTPTransport.Options = {
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER!.trim(),
      pass: smtpPass(),
    },
  };
  return nodemailer.createTransport(options);
}

/**
 * Sends mail via SMTP when env is set.
 * If SMTP_* is missing, returns skipped (never throws) so checkout/admin keep working.
 */
export async function sendMail(payload: MailPayload): Promise<MailResult> {
  if (!smtpConfigured()) {
    console.info(
      "[mail] SMTP not configured — skipped send.",
      { to: payload.to, subject: payload.subject },
    );
    return {
      ok: true,
      skipped: true,
      reason: "SMTP_HOST / SMTP_USER / SMTP_PASS / SMTP_FROM not set in env yet.",
    };
  }

  try {
    const from =
      process.env.SMTP_FROM?.trim() ||
      `"${process.env.SMTP_FROM_NAME?.trim() || "HYDRA"}" <${process.env.SMTP_USER!.trim()}>`;
    const info = await transporter().sendMail({
      from,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
      replyTo: payload.replyTo || process.env.SMTP_REPLY_TO?.trim() || undefined,
    });
    return { ok: true, messageId: info.messageId || "sent" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "SMTP send failed.";
    console.error("[mail]", message);
    return { ok: false, error: message };
  }
}

export function isSmtpReady() {
  return smtpConfigured();
}
