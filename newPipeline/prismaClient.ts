import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });

const createPrismaClient = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
