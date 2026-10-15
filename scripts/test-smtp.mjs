import "dotenv/config";
import nodemailer from "nodemailer";

function smtpPass() {
  for (const raw of [process.env.SMTP_PASS, process.env.SMTP_PASSWORD]) {
    const pass = raw?.trim() ?? "";
    if (!pass) continue;
    if (/^your[_-]?mailbox[_-]?password$/i.test(pass)) continue;
    if (/^change.?me/i.test(pass)) continue;
    return pass;
  }
  return "";
}

const host = process.env.SMTP_HOST?.trim();
const user = process.env.SMTP_USER?.trim();
const pass = smtpPass();
const port = Number(process.env.SMTP_PORT || 465);
const secure = process.env.SMTP_SECURE === "true" || port === 465;

console.log(
  JSON.stringify({
    host,
    port,
    secure,
    user,
    from: process.env.SMTP_FROM,
    passLen: pass.length,
    configured: Boolean(host && user && pass),
  }),
);

if (!host || !user || !pass) {
  console.error("SMTP not configured");
  process.exit(1);
}

const transport = nodemailer.createTransport({
  host,
  port,
  secure,
  auth: { user, pass },
});

try {
  await transport.verify();
  console.log("SMTP_VERIFY_OK");
} catch (e) {
  console.error("SMTP_VERIFY_FAIL", e instanceof Error ? e.message : e);
  process.exit(2);
}
