import { z } from 'zod';

export const orderItemSchema = z.object({
  fragranceSlug: z.string().min(1),
  quantity: z.number().int().min(1).max(10),
  size: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  contact: z.object({
    email: z.string().email(),
    marketing: z.boolean().default(false),
  }),
  delivery: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address1: z.string().min(1),
    address2: z.string().optional().default(''),
    city: z.string().min(1),
    country: z.string().min(1),
    method: z.enum(['standard', 'express', 'nextday']),
    phone: z.string().min(6).optional().or(z.literal('')),
    postcode: z.string().min(1),
  }),
  items: z.array(orderItemSchema).min(1),
  promoCode: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
