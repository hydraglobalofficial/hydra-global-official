/** Load `.env` then `.env.local` (Next.js local secrets). `.env` alone is often missing. */
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const cwd = process.cwd();
for (const name of [".env", ".env.local"]) {
  const file = path.join(cwd, name);
  if (!fs.existsSync(file)) continue;
  dotenv.config({ path: file, override: name.endsWith(".local") });
}
