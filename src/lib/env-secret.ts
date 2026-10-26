import "server-only";
import fs from "fs";
import path from "path";

/**
 * Read a secret from `.env.local` / `.env` without Next.js dotenv-expand eating `$`.
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
    // `.env.local` wins — that is where local secrets actually live.
    for (const name of [".env.local", ".env"]) {
      const envPath = path.join(process.cwd(), name);
      if (!fs.existsSync(envPath)) continue;
      const text = fs.readFileSync(envPath, "utf8");
      // Prefer later keys when both exist (e.g. SMTP_PASSWORD over SMTP_PASS).
      for (let i = keys.length - 1; i >= 0; i--) {
        const key = keys[i]!;
        const match = text.match(new RegExp(`^${key}=(.*)$`, "m"));
        if (!match) continue;
        const value = normalizeSecret(match[1]);
        if (value) return value;
      }
    }
  } catch {
    // No dotenv file on serverless — use process.env
  }
  return "";
}
