import "dotenv/config";
import nodemailer from "nodemailer";

function smtpPass() {
  const candidates = [process.env.SMTP_PASS, process.env.SMTP_PASSWORD];
  for (const raw of candidates) {
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
const from = process.env.SMTP_FROM?.trim();
const portEnv = process.env.SMTP_PORT;
const secureEnv = process.env.SMTP_SECURE;

console.log("host:", host);
console.log("user:", user);
console.log("from:", from);
console.log("SMTP_PORT raw:", JSON.stringify(portEnv));
console.log("SMTP_SECURE raw:", JSON.stringify(secureEnv));
console.log("SMTP_PASS set:", Boolean(process.env.SMTP_PASS?.trim()));
console.log("SMTP_PASSWORD set:", Boolean(process.env.SMTP_PASSWORD?.trim()));
console.log("resolved pass len:", pass.length);
console.log("pass has surrounding quotes:", /^["'].*["']$/.test(pass));
console.log("pass has whitespace:", /\s/.test(pass));

if (!host || !user || !pass) {
  console.error("Missing host/user/pass");
  process.exit(1);
}

async function tryConfig(label, options) {
  const t = nodemailer.createTransport(options);
  try {
    await t.verify();
    console.log(`OK  ${label}`);
    return true;
  } catch (e) {
    console.log(`FAIL ${label}:`, e.message);
    return false;
  }
}

const attempts = [
  ["465 ssl", { host, port: 465, secure: true, auth: { user, pass } }],
  ["587 starttls", { host, port: 587, secure: false, requireTLS: true, auth: { user, pass } }],
  [
    "465 + tls.rejectUnauthorized false",
    {
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    },
  ],
  [
    "587 + name=user without domain",
    {
      host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: user.split("@")[0], pass },
    },
  ],
];

let anyOk = false;
for (const [label, opts] of attempts) {
  // eslint-disable-next-line no-await-in-loop
  if (await tryConfig(label, opts)) anyOk = true;
}
process.exit(anyOk ? 0 : 2);
