import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL missing");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString, max: 1 }),
});

const data = {
  enabled: true,
  phone: "8801635992804",
  message: "Hi HYDRA! I have a question.",
  rotateSeconds: 3,
  staff: [
    { name: "Support A", image: "/products/glass-clear.jpg" },
    { name: "Support B", image: "/products/glass-privacy.jpg" },
    { name: "Support C", image: "/products/case-clear.jpg" },
  ],
};

await prisma.siteSection.upsert({
  where: { key: "site.whatsapp" },
  create: { key: "site.whatsapp", title: "WhatsApp float", data },
  update: { data, title: "WhatsApp float" },
});

console.log("OK seeded site.whatsapp", data.staff.length, "photos");
await prisma.$disconnect();
