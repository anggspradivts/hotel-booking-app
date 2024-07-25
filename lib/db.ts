import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient();

// db.$connect().catch((err) => {
//   console.error('Error connecting to the database', err);
// });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;