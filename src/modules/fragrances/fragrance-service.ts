import { ScentFamily } from '@/types/fragrance.js';
import { fragrances, getFragranceBySlug } from '@/data/mock-data/fragrances.js';

export interface FragranceFilters {
  family?: ScentFamily;
  isBestseller?: boolean;
  isNew?: boolean;
}

export function listFragrances(filters: FragranceFilters) {
  return fragrances.filter((fragrance) => {
    const matchesFamily = filters.family ? fragrance.family.includes(filters.family) : true;
    const matchesBestseller = typeof filters.isBestseller === 'boolean'
      ? fragrance.isBestseller === filters.isBestseller
      : true;
    const matchesNew = typeof filters.isNew === 'boolean'
      ? fragrance.isNew === filters.isNew
      : true;

    return matchesFamily && matchesBestseller && matchesNew;
  });
}

export function findFragrance(slug: string) {
  return getFragranceBySlug(slug);
}
