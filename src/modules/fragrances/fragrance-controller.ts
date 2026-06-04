import { Request, Response } from 'express';
import { HttpError } from '@/errors/http-error.js';
import { fragranceQuerySchema } from './fragrance-schema.js';
import { findFragrance, listFragrances } from './fragrance-service.js';

export async function getFragrances(request: Request, response: Response): Promise<void> {
  const filters = fragranceQuerySchema.parse(request.query);
  const data = await listFragrances(filters);
  response.json({ data });
}

export async function getFragrance(request: Request, response: Response): Promise<void> {
  const fragrance = await findFragrance(request.params.slug);

  if (!fragrance) {
    throw new HttpError(404, 'FRAGRANCE_NOT_FOUND', 'Fragrance was not found.');
  }

  response.json({ data: fragrance });
}
