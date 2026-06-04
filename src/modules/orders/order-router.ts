import { Router } from 'express';
import { postOrder, getOrderById } from './order-controller.js';

export const orderRouter = Router();

orderRouter.post('/', postOrder);
orderRouter.get('/:id', getOrderById);
