import { Request, Response } from 'express';
import { HttpError } from '@/errors/http-error.js';
import { articleQuerySchema } from './article-schema.js';
import { findArticle, listArticles } from './article-service.js';

export function getArticles(request: Request, response: Response): void {
  const query = articleQuerySchema.parse(request.query);
  response.json({ data: listArticles(query.category) });
}

export function getArticle(request: Request, response: Response): void {
  const article = findArticle(request.params.slug);

  if (!article) {
    throw new HttpError(404, 'ARTICLE_NOT_FOUND', 'Article was not found.');
  }

  response.json({ data: article });
}
