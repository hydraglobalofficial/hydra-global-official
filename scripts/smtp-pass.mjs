/** Shared: read SMTP password from .env without $ variable expansion. */
import fs from "fs";

export function readSmtpPass() {
  const text = fs.readFileSync(".env", "utf8");
  for (const key of ["SMTP_PASS", "SMTP_PASSWORD"]) {
    const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
    if (!match) continue;
    let pass = match[1].trim();
    if (
      (pass.startsWith('"') && pass.endsWith('"')) ||
      (pass.startsWith("'") && pass.endsWith("'"))
    ) {
      pass = pass.slice(1, -1);
    }
    if (pass.includes("$$")) pass = pass.replaceAll("$$", "$");
    if (!pass) continue;
    if (/^your[_-]?mailbox[_-]?password$/i.test(pass)) continue;
    if (/^change.?me/i.test(pass)) continue;
    return pass;
  }
  return "";
}
