import { z } from 'zod';

const booleanQuerySchema = z.preprocess((value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean());

export const fragranceQuerySchema = z.object({
  family: z.enum(['woody', 'floral', 'citrus', 'amber', 'fresh', 'gourmand']).optional(),
  isBestseller: booleanQuerySchema.optional(),
  isNew: booleanQuerySchema.optional(),
});
