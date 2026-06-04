import { ArticleCategory } from '@/types/editorial.js';
import { articles, getArticleBySlug } from '@/data/mock-data/articles.js';

export function listArticles(category?: ArticleCategory) {
  return category ? articles.filter((article) => article.category === category) : articles;
}

export function findArticle(slug: string) {
  return getArticleBySlug(slug);
}
