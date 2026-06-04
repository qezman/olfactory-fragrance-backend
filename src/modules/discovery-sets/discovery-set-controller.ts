import { Request, Response } from 'express';
import { HttpError } from '@/errors/http-error.js';
import { findDiscoverySet, listDiscoverySets } from './discovery-set-service.js';

export function getDiscoverySets(_request: Request, response: Response): void {
  response.json({ data: listDiscoverySets() });
}

export function getDiscoverySet(request: Request, response: Response): void {
  const discoverySet = findDiscoverySet(request.params.slug);

  if (!discoverySet) {
    throw new HttpError(404, 'DISCOVERY_SET_NOT_FOUND', 'Discovery set was not found.');
  }

  response.json({ data: discoverySet });
}
