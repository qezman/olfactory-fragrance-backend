import { Request, Response } from 'express';

export function notFoundHandler(request: Request, response: Response): void {
  response.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `No route found for ${request.method} ${request.path}`,
    },
  });
}
