import { Request, Response } from 'express';
import { validatePromoSchema } from './promo-schema.js';
import { getPromoRate, normalizePromoCode } from './promo-service.js';

export function validatePromo(request: Request, response: Response): void {
  const payload = validatePromoSchema.parse(request.body);
  const code = normalizePromoCode(payload.code);
  const rate = getPromoRate(code);

  response.json({
    data: {
      code,
      discountRate: rate ?? 0,
      isValid: rate !== null,
    },
  });
}
