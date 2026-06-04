import { describe, expect, it } from 'vitest';
import { listFragrances } from '@/modules/fragrances/fragrance-service.js';
import { createOrder } from '@/modules/orders/order-service.js';
import { getPromoRate } from '@/modules/promos/promo-service.js';

describe('fragrance service', () => {
  it('filters fragrances by family', () => {
    const fragrances = listFragrances({ family: 'woody' });

    expect(fragrances.length).toBeGreaterThan(0);
    expect(fragrances.every((fragrance) => fragrance.family.includes('woody'))).toBe(true);
  });
});

describe('promo service', () => {
  it('normalizes valid promo codes', () => {
    expect(getPromoRate(' welcome10 ')).toBe(0.1);
  });
});

describe('order service', () => {
  it('calculates order totals from catalog prices', () => {
    const order = createOrder({
      contact: {
        email: 'customer@example.com',
        marketing: true,
      },
      delivery: {
        address1: '10 Scent Lane',
        address2: '',
        city: 'Lagos',
        country: 'Nigeria',
        firstName: 'Ada',
        lastName: 'Okoro',
        method: 'standard',
        phone: '+2348012345678',
        postcode: '100001',
      },
      items: [
        {
          fragranceSlug: 'cedar-08',
          quantity: 1,
          size: 50,
        },
      ],
      promoCode: 'WELCOME10',
    });

    expect(order.totals.subtotal).toBe(135);
    expect(order.totals.discount).toBe(13.5);
    expect(order.totals.shipping).toBe(0);
    expect(order.totals.total).toBe(121.5);
  });
});
