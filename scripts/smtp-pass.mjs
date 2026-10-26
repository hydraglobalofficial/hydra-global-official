/** Shared: read SMTP password from `.env.local` / `.env` without $ expansion. */
import fs from "fs";

function normalize(raw) {
  let pass = (raw ?? "").trim();
  if (
    (pass.startsWith('"') && pass.endsWith('"')) ||
    (pass.startsWith("'") && pass.endsWith("'"))
  ) {
    pass = pass.slice(1, -1);
  }
  if (pass.includes("$$")) pass = pass.replaceAll("$$", "$");
  if (!pass) return "";
  if (/^your[_-]?mailbox[_-]?password$/i.test(pass)) return "";
  if (/^change.?me/i.test(pass)) return "";
  if (/^<.*>$/.test(pass)) return "";
  return pass;
}

/** Prefer SMTP_PASSWORD over SMTP_PASS when both exist. `.env.local` wins. */
export function readSmtpPass() {
  try {
    for (const name of [".env.local", ".env"]) {
      if (!fs.existsSync(name)) continue;
      const text = fs.readFileSync(name, "utf8");
      for (const key of ["SMTP_PASSWORD", "SMTP_PASS"]) {
        const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
        if (!match) continue;
        const pass = normalize(match[1]);
        if (pass) return pass;
      }
    }
  } catch {
    // fall through
  }
  return normalize(process.env.SMTP_PASSWORD) || normalize(process.env.SMTP_PASS);
}
