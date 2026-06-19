import { randomUUID } from 'node:crypto';
import { HttpError } from '@/errors/http-error.js';
import { findDiscoverySet } from '@/modules/discovery-sets/discovery-set-service.js';
import { findFragrance } from '@/modules/fragrances/fragrance-service.js';
import { getPromoRate, normalizePromoCode } from '@/modules/promos/promo-service.js';
import { CreateOrderInput } from './order-schema.js';
import pkg from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const { PrismaClient } = pkg;
const prisma = new PrismaClient({ adapter });

const deliveryPrices = {
  express: 9.95,
  nextday: 14.95,
  standard: 4.95,
} as const;

const freeShippingThreshold = 75;
const customDiscoverySetSlug = 'custom-set';
const customDiscoverySetPrice = 35;

export interface OrderLineItem {
  fragranceSlug: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
  fragranceId?: string;
}

export interface OrderTotals {
  discount: number;
  discountRate: number;
  shipping: number;
  subtotal: number;
  total: number;
}

async function buildLineItems(items: CreateOrderInput['items']): Promise<OrderLineItem[]> {
  const lineItems: OrderLineItem[] = [];
  
  for (const item of items) {
    if (item.fragranceSlug === customDiscoverySetSlug) {
      lineItems.push({
        fragranceSlug: customDiscoverySetSlug,
        name: 'Custom Discovery Set',
        price: customDiscoverySetPrice,
        quantity: item.quantity,
        size: item.size,
      });
      continue;
    }

    const discoverySet = findDiscoverySet(item.fragranceSlug);
    if (discoverySet) {
      lineItems.push({
        fragranceSlug: discoverySet.slug,
        name: discoverySet.name,
        price: discoverySet.price,
        quantity: item.quantity,
        size: item.size,
      });
      continue;
    }

    const fragrance = await findFragrance(item.fragranceSlug);
    if (!fragrance) {
      throw new HttpError(400, 'PRODUCT_NOT_FOUND', `Product ${item.fragranceSlug} was not found.`);
    }

    const size = fragrance.sizes.find((candidate) => candidate.ml === item.size);
    if (!size) {
      throw new HttpError(400, 'FRAGRANCE_SIZE_NOT_FOUND', `${fragrance.name} is not available in ${item.size}ml.`);
    }

    lineItems.push({
      fragranceSlug: fragrance.slug,
      name: fragrance.name,
      price: size.price,
      quantity: item.quantity,
      size: size.ml,
      fragranceId: fragrance.id,
    });
  }
  
  return lineItems;
}

function calculateTotals(input: CreateOrderInput, items: OrderLineItem[]): OrderTotals {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountRate = input.promoCode ? getPromoRate(input.promoCode) ?? 0 : 0;
  const discount = Number((subtotal * discountRate).toFixed(2));
  const baseShipping = deliveryPrices[input.delivery.method];
  const shipping = input.delivery.method === 'standard' && subtotal >= freeShippingThreshold ? 0 : baseShipping;
  const total = Number((subtotal - discount + shipping).toFixed(2));

  return {
    discount,
    discountRate,
    shipping,
    subtotal,
    total,
  };
}

export async function createOrder(input: CreateOrderInput) {
  const items = await buildLineItems(input.items);
  const totals = calculateTotals(input, items);
  const id = `OLF-${randomUUID().slice(0, 8).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      id,
      contactEmail: input.contact.email,
      contactPhone: input.delivery.phone,
      firstName: input.delivery.firstName,
      lastName: input.delivery.lastName,
      delivery: input.delivery as any,
      promoCode: input.promoCode ? normalizePromoCode(input.promoCode) : null,
      discount: totals.discount,
      discountRate: totals.discountRate,
      shipping: totals.shipping,
      subtotal: totals.subtotal,
      total: totals.total,
      items: {
        create: items.map(item => ({
          fragranceSlug: item.fragranceSlug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          fragranceId: item.fragranceId,
        }))
      }
    },
    include: {
      items: true
    }
  });

  return order;
}

export async function listOrders() {
  return prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true
    }
  });
}
