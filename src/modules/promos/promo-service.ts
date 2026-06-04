const promoRates = {
  SAMPLE20: 0.2,
  WELCOME10: 0.1,
} as const;

export type PromoCode = keyof typeof promoRates;

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getPromoRate(code: string): number | null {
  const normalizedCode = normalizePromoCode(code);

  if (normalizedCode in promoRates) {
    return promoRates[normalizedCode as PromoCode];
  }

  return null;
}
