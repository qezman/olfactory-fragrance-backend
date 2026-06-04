import { Request, Response } from 'express';
import { createOrderSchema } from './order-schema.js';
import { createOrder, getOrder } from './order-service.js';
import { HttpError } from '@/errors/http-error.js';

export async function postOrder(request: Request, response: Response): Promise<void> {
  const payload = createOrderSchema.parse(request.body);
  const order = await createOrder(payload);

  response.status(201).json({ data: order });
}

export async function getOrderById(request: Request, response: Response): Promise<void> {
  const { id } = request.params;
  const order = await getOrder(id);

  if (!order) {
    throw new HttpError(404, 'ORDER_NOT_FOUND', `Order with ID ${id} was not found.`);
  }

  response.status(200).json({ data: order });
}
