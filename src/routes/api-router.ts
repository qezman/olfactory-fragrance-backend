import { Router } from 'express';
import { articleRouter } from '@/modules/articles/article-router.js';
import { discoverySetRouter } from '@/modules/discovery-sets/discovery-set-router.js';
import { fragranceRouter } from '@/modules/fragrances/fragrance-router.js';
import { healthRouter } from '@/modules/health/health-router.js';
import { orderRouter } from '@/modules/orders/order-router.js';
import { promoRouter } from '@/modules/promos/promo-router.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/discovery-sets', discoverySetRouter);
apiRouter.use('/fragrances', fragranceRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/promos', promoRouter);
