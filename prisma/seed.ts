import 'dotenv/config';
import pkg from '@prisma/client';
import { fragrances } from '../src/data/mock-data/fragrances.js';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const { PrismaClient } = pkg;
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.ingredient.deleteMany({});
  await prisma.fragranceSize.deleteMany({});
  await prisma.fragrance.deleteMany({});

  for (const fragrance of fragrances) {
    console.log(`Seeding fragrance: ${fragrance.name}`);
    
    await prisma.fragrance.create({
      data: {
        slug: fragrance.slug,
        name: fragrance.name,
        tagline: fragrance.tagline,
        family: fragrance.family,
        topNotes: fragrance.topNotes,
        heartNotes: fragrance.heartNotes,
        baseNotes: fragrance.baseNotes,
        story: fragrance.story,
        howItWears: fragrance.howItWears as any,
        images: fragrance.images,
        isBestseller: fragrance.isBestseller,
        isNew: fragrance.isNew,
        sizes: {
          create: fragrance.sizes.map((size) => ({
            ml: size.ml,
            price: size.price,
          })),
        },
        ingredients: {
          create: fragrance.ingredients.map((ing) => ({
            name: ing.name,
            origin: ing.origin,
            description: ing.description,
          })),
        },
      },
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
