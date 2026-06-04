import { randomUUID } from 'node:crypto';
import { HttpError } from '@/errors/http-error.js';
import { findFragrance } from '@/modules/fragrances/fragrance-service.js';
import { getPromoRate, normalizePromoCode } from '@/modules/promos/promo-service.js';
import { CreateOrderInput } from './order-schema.js';

const deliveryPrices = {
  express: 9.95,
  nextday: 14.95,
  standard: 4.95,
} as const;

const freeShippingThreshold = 75;

export interface OrderLineItem {
  fragranceSlug: string;
  name: string;
  price: number;
  quantity: number;
  size: number;
}

export interface OrderTotals {
  discount: number;
  discountRate: number;
  shipping: number;
  subtotal: number;
  total: number;
}

export interface Order {
  contact: CreateOrderInput['contact'];
  createdAt: string;
  delivery: CreateOrderInput['delivery'];
  id: string;
  items: OrderLineItem[];
  promoCode: string | null;
  totals: OrderTotals;
}

const orders: Order[] = [];

function buildLineItems(items: CreateOrderInput['items']): OrderLineItem[] {
  return items.map((item) => {
    const fragrance = findFragrance(item.fragranceSlug);

    if (!fragrance) {
      throw new HttpError(400, 'FRAGRANCE_NOT_FOUND', `Fragrance ${item.fragranceSlug} was not found.`);
    }

    const size = fragrance.sizes.find((candidate) => candidate.ml === item.size);

    if (!size) {
      throw new HttpError(400, 'FRAGRANCE_SIZE_NOT_FOUND', `${fragrance.name} is not available in ${item.size}ml.`);
    }

    return {
      fragranceSlug: fragrance.slug,
      name: fragrance.name,
      price: size.price,
      quantity: item.quantity,
      size: size.ml,
    };
  });
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

export function createOrder(input: CreateOrderInput): Order {
  const items = buildLineItems(input.items);
  const totals = calculateTotals(input, items);
  const order: Order = {
    contact: input.contact,
    createdAt: new Date().toISOString(),
    delivery: input.delivery,
    id: `OLF-${randomUUID().slice(0, 8).toUpperCase()}`,
    items,
    promoCode: input.promoCode ? normalizePromoCode(input.promoCode) : null,
    totals,
  };

  orders.push(order);

  return order;
}

export function listOrders(): Order[] {
  return orders;
}
