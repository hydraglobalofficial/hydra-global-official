import "./load-dotenv.mjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

/**
 * Ensures WhatsApp float row exists. Never wipes real staff uploads.
 * Only drops leftover /products/ placeholder seeds.
 */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString, max: 1 }),
});

const defaults = {
  enabled: true,
  phone: "8801635992804",
  message: "Hi HYDRA! I have a question.",
  rotateSeconds: 3,
  staff: [],
};

const existing = await prisma.siteSection.findUnique({ where: { key: "site.whatsapp" } });
const current =
  existing?.data && typeof existing.data === "object" && !Array.isArray(existing.data)
    ? { ...existing.data }
    : {};

const staff = Array.isArray(current.staff)
  ? current.staff.filter((s) => {
      if (!s || typeof s !== "object") return false;
      const image = typeof s.image === "string" ? s.image.trim() : "";
      if (!image) return false;
      if (image.startsWith("/products/")) return false;
      return true;
    })
  : [];

const data = {
  ...defaults,
  ...current,
  phone: typeof current.phone === "string" && current.phone.trim() ? current.phone : defaults.phone,
  staff,
};

await prisma.siteSection.upsert({
  where: { key: "site.whatsapp" },
  create: { key: "site.whatsapp", title: "WhatsApp float", data },
  update: { title: "WhatsApp float", data },
});

console.log("OK site.whatsapp staff count:", staff.length);
await prisma.$disconnect();
