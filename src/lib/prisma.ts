import { PrismaClient } from "@prisma/client";

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

// Attach prisma to global object to prevent multiple instances during hot-reloading
if (process.env.NODE_ENV !== "production") global.prisma = prisma;