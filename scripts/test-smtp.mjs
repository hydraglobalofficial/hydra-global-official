/**
 * Live Hostinger SMTP login check.
 * Usage: pnpm mail:test
 * Never prints the password — only length + verify result.
 */
import "./load-dotenv.mjs";
import nodemailer from "nodemailer";
import { readSmtpPass } from "./smtp-pass.mjs";

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
// Read from .env file (no $ expansion) — same as app smtp.ts
const pass = readSmtpPass() || process.env.SMTP_PASSWORD?.trim() || "";
const port = Number(process.env.SMTP_PORT || 465);
const secure =
  process.env.SMTP_SECURE === "1" ||
  process.env.SMTP_SECURE === "true" ||
  port === 465;
const from = process.env.SMTP_FROM?.trim() || (user ? `HYDRA <${user}>` : null);

console.log(
  JSON.stringify(
    {
      host,
      port,
      secure,
      user,
      from,
      passLen: pass.length,
      configured: Boolean(host && user && pass),
    },
    null,
    2,
  ),
);

if (!host || !user || !pass) {
  console.error("\nSMTP not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  requireTLS: !secure && port === 587,
  tls: { minVersion: "TLSv1.2" },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
});

try {
  await transport.verify();
  console.log("\nSMTP_VERIFY_OK — Hostinger accepted login. Invoice emails can send.");
  process.exit(0);
} catch (e) {
  const msg = e instanceof Error ? e.message : String(e);
  console.error("\nSMTP_VERIFY_FAIL", msg);
  if (/535|Invalid login|authentication failed|EAUTH/i.test(msg)) {
    console.error(`
Fix (Hostinger):
  1. Hostinger hPanel → Emails → manage ${user}
  2. Reset mailbox password (not your Hostinger account password)
  3. Put the NEW password in .env:
       SMTP_PASSWORD="your-new-password"
  4. Restart the app, then run: pnpm mail:test
`);
  }
  process.exit(2);
}
