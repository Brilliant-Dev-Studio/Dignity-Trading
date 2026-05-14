import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString =
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  process.env.DIRECT_URL ??
  "";

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaPg({
      // Pooled URL for runtime queries (serverless friendly)
      connectionString,
    }),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

function getPrisma(): PrismaClient {
  const cached = globalForPrisma.prisma;
  // After `prisma generate`, Next dev can keep a stale PrismaClient on globalThis that
  // predates new models — delegates like `publicCourse` are then missing → runtime 500.
  if (
    cached &&
    typeof (cached as unknown as { publicCourse?: { findUnique?: unknown } }).publicCourse
      ?.findUnique !== "function"
  ) {
    void cached.$disconnect().catch(() => {});
    globalForPrisma.prisma = undefined;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = getPrisma();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

