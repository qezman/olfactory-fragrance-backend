import { Router } from 'express';
import { getDiscoverySet, getDiscoverySets } from './discovery-set-controller.js';

export const discoverySetRouter = Router();

discoverySetRouter.get('/', getDiscoverySets);
discoverySetRouter.get('/:slug', getDiscoverySet);
