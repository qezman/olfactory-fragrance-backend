import { discoverySets, getSetBySlug } from '@/data/mock-data/sets.js';

export function listDiscoverySets() {
  return discoverySets;
}

export function findDiscoverySet(slug: string) {
  return getSetBySlug(slug);
}
