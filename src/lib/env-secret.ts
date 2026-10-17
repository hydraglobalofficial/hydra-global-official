import "server-only";
import fs from "fs";
import path from "path";

/**
 * Read a secret from .env without Next.js dotenv-expand eating `$` in passwords.
 * Falls back to process.env (Vercel / production).
 */
export function readEnvSecret(keys: string[]): string {
  const fromFile = readFromDotenvFile(keys);
  if (fromFile) return fromFile;
  for (const key of keys) {
    const pass = normalizeSecret(process.env[key]);
    if (pass) return pass;
  }
  return "";
}

function normalizeSecret(raw: string | undefined) {
  let value = raw?.trim() ?? "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  if (value.includes("$$")) value = value.replaceAll("$$", "$");
  if (!value) return "";
  if (/^your[_-]?.*[_-]?password$/i.test(value)) return "";
  if (/^change.?me/i.test(value)) return "";
  if (/^<.*>$/.test(value)) return "";
  return value;
}

function readFromDotenvFile(keys: string[]) {
  try {
    const envPath = path.join(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";
    const text = fs.readFileSync(envPath, "utf8");
    // Prefer later keys when both exist (e.g. SMTP_PASSWORD over SMTP_PASS).
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i]!;
      const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
      if (!match) continue;
      const value = normalizeSecret(match[1]);
      if (value) return value;
    }
  } catch {
    // No .env on serverless — use process.env
  }
  return "";
}
