import { Router } from 'express';

import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const router = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

// os acessos precisam ser autenticados
router.use(Autheticated);

router.get('/', providersController.index);
router.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);
router.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default router;
