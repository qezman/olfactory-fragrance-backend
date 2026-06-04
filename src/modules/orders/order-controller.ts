import { Request, Response } from 'express';
import { createOrderSchema } from './order-schema.js';
import { createOrder } from './order-service.js';

export function postOrder(request: Request, response: Response): void {
  const payload = createOrderSchema.parse(request.body);
  const order = createOrder(payload);

  response.status(201).json({ data: order });
}
