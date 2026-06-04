import { Router } from 'express';
import { postOrder } from './order-controller.js';

export const orderRouter = Router();

orderRouter.post('/', postOrder);
