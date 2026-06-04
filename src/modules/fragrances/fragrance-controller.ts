import { Request, Response } from 'express';
import { HttpError } from '@/errors/http-error.js';
import { fragranceQuerySchema } from './fragrance-schema.js';
import { findFragrance, listFragrances } from './fragrance-service.js';

export function getFragrances(request: Request, response: Response): void {
  const filters = fragranceQuerySchema.parse(request.query);
  response.json({ data: listFragrances(filters) });
}

export function getFragrance(request: Request, response: Response): void {
  const fragrance = findFragrance(request.params.slug);

  if (!fragrance) {
    throw new HttpError(404, 'FRAGRANCE_NOT_FOUND', 'Fragrance was not found.');
  }

  response.json({ data: fragrance });
}
