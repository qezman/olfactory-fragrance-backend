import { ScentFamily } from '@/types/fragrance.js';
import pkg from '@prisma/client';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const { PrismaClient } = pkg;
const prisma = new PrismaClient({ adapter });

export interface FragranceFilters {
  family?: ScentFamily;
  isBestseller?: boolean;
  isNew?: boolean;
}

export async function listFragrances(filters: FragranceFilters) {
  const whereClause: any = {};

  if (filters.family) {
    whereClause.family = { has: filters.family };
  }
  if (typeof filters.isBestseller === 'boolean') {
    whereClause.isBestseller = filters.isBestseller;
  }
  if (typeof filters.isNew === 'boolean') {
    whereClause.isNew = filters.isNew;
  }

  return prisma.fragrance.findMany({
    where: whereClause,
    include: {
      sizes: true,
      ingredients: true,
    },
  });
}

export async function findFragrance(slug: string) {
  return prisma.fragrance.findUnique({
    where: { slug },
    include: {
      sizes: true,
      ingredients: true,
    },
  });
}
