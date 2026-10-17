/**
 * Sends one real SMTP test message using current .env.
 * Usage: node scripts/send-test-invoice.mjs [to@email]
 */
import "dotenv/config";
import nodemailer from "nodemailer";
import { readSmtpPass } from "./smtp-pass.mjs";

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = readSmtpPass() || process.env.SMTP_PASSWORD?.trim() || "";
const port = Number(process.env.SMTP_PORT || 465);
const secure =
  process.env.SMTP_SECURE === "1" ||
  process.env.SMTP_SECURE === "true" ||
  port === 465;
const from = process.env.SMTP_FROM?.trim() || `HYDRA <${user}>`;
const to = process.argv[2] || user;

if (!host || !user || !pass) {
  console.error("SMTP not configured");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
  tls: { minVersion: "TLSv1.2" },
});

await transport.verify();
const info = await transport.sendMail({
  from,
  to,
  subject: "HYDRA SMTP test — invoice mail OK",
  text: [
    "HYDRA SMTP connectivity test",
    "",
    `From: ${from}`,
    `To: ${to}`,
    `Time: ${new Date().toISOString()}`,
    "",
    "If you received this, invoice emails can send from this environment.",
  ].join("\n"),
  html: `<div style="font-family:Segoe UI,Arial,sans-serif;padding:24px;color:#111">
    <h2 style="margin:0 0 8px">HYDRA SMTP test</h2>
    <p style="margin:0 0 12px;color:#555">Invoice mail pipeline verified.</p>
    <p style="margin:0;font-size:13px;color:#333"><strong>From:</strong> ${from}<br/>
    <strong>To:</strong> ${to}<br/>
    <strong>Time:</strong> ${new Date().toISOString()}</p>
  </div>`,
});

console.log(
  JSON.stringify(
    {
      ok: true,
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      from,
      to,
    },
    null,
    2,
  ),
);
