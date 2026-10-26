import "./scripts/load-dotenv.mjs";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct (non-pooled) connection; `prisma generate` needs none.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
