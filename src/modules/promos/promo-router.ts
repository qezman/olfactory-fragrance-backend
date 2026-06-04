import { Router } from 'express';
import { validatePromo } from './promo-controller.js';

export const promoRouter = Router();

promoRouter.post('/validate', validatePromo);
