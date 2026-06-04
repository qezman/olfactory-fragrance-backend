import { Router } from 'express';
import { getArticle, getArticles } from './article-controller.js';

export const articleRouter = Router();

articleRouter.get('/', getArticles);
articleRouter.get('/:slug', getArticle);
