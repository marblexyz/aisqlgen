// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare let global: { prisma: PrismaClient | undefined | null };

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (global.prisma === undefined || global.prisma === null) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
