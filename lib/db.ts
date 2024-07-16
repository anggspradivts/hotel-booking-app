import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

db.$connect().catch((err) => {
  console.error('Error connecting to the database', err);
});

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;