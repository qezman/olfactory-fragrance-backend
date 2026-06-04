import { Request, Response } from 'express';

export function getHealth(_request: Request, response: Response): void {
  response.json({
    data: {
      name: 'olfactory-fragrance-backend',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
}
