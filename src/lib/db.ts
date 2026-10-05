import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Neon / serverless-friendly pool.
 * Too many concurrent connections → P2028 (can't start transaction in time).
 */
function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and configure it.");
  }

  const isProd = process.env.NODE_ENV === "production";
  const max =
    Number(process.env.DATABASE_POOL_MAX) ||
    (process.env.VERCEL || process.env.DATABASE_URL?.includes("neon.tech") ? 3 : isProd ? 8 : 5);

  return new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
      max,
      // Wait longer for a free connection (Neon cold start / pool contention).
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS) || 15_000,
      idleTimeoutMillis: 20_000,
      allowExitOnIdle: true,
    }),
  });
}

// Reuse one client across hot reloads in development.
export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** Interactive transaction defaults — avoid P2028 on slow / cold Neon. */
export const TX = {
  maxWait: 20_000,
  timeout: 45_000,
} as const;

function isTxStartTimeout(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2028";
}

/**
 * Run a Prisma interactive transaction with Neon-safe timeouts + one retry on P2028.
 */
export async function withTransaction<T>(
  fn: (tx: Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0]) => Promise<T>,
  opts: { maxWait?: number; timeout?: number; retries?: number } = {},
): Promise<T> {
  const maxWait = opts.maxWait ?? TX.maxWait;
  const timeout = opts.timeout ?? TX.timeout;
  const retries = opts.retries ?? 1;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await db.$transaction(fn, { maxWait, timeout });
    } catch (error) {
      lastError = error;
      if (!isTxStartTimeout(error) || attempt === retries) throw error;
      // Brief backoff so the pool can free a connection.
      await new Promise((r) => setTimeout(r, 400 + attempt * 400));
    }
  }
  throw lastError;
}
