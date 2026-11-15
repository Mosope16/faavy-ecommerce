import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Resilient query wrapper that automatically retries when Neon serverless
 * compute is cold-starting or when connection pool latency causes a transient timeout.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
  delayMs = 800
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (err: unknown) {
      lastError = err;
      const isTransient =
        err instanceof Error &&
        (err.message.includes("Timed out fetching a new connection") ||
          err.message.includes("Can't reach database server") ||
          err.message.includes("Connection pool timeout") ||
          err.message.includes("connection pool") ||
          err.name === "PrismaClientInitializationError" ||
          err.name === "PrismaClientKnownRequestError");

      if (isTransient && attempt < retries) {
        console.warn(
          `[Prisma] Neon compute wake-up delay detected. Retrying in ${delayMs * (attempt + 1)}ms (attempt ${attempt + 1}/${retries})...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}


