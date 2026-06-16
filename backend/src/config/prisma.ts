import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({ connectionString: process.env.DATABASE_URL});

const adapter = new PrismaPg(pool);

// To be sure any duplicated open connection is not accidentally created during hot-reloads

const globalForPrisma = globalThis as unknown as { prisma: any };
export const prisma = globalForPrisma.prisma || new (PrismaClient as any)({
    adapter,
    log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;