// Import from the custom generated location instead of @prisma/client
import { PrismaClient } from "../../prisma/generated";

// Prevent multiple instances of Prisma Client in development
declare global {
  const prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

// Attach prisma to global object to prevent multiple instances during hot-reloading
if (process.env.NODE_ENV !== "production") global.prisma = prisma;