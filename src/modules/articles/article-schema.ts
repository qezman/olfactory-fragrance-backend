import { z } from 'zod';

export const articleQuerySchema = z.object({
  category: z.enum(['essay', 'interview', 'ingredient', 'behind-the-scent']).optional(),
});
