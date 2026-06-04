import { Router } from 'express';
import { getFragrance, getFragrances } from './fragrance-controller.js';

export const fragranceRouter = Router();

fragranceRouter.get('/', getFragrances);
fragranceRouter.get('/:slug', getFragrance);
