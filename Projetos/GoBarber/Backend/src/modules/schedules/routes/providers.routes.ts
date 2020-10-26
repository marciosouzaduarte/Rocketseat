import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import authenticated from '@shared/infra/http/middleware/autenticacao';

import ProvidersController from '../controllers/ProvidersController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';

const router = Router();
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

// os acessos precisam ser autenticados
router.use(authenticated);

router.get('/', providersController.index);

router.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: { provider_id: Joi.string().uuid().required() },
  }),
  providerMonthAvailabilityController.index,
);

router.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: { provider_id: Joi.string().uuid().required() },
  }),
  providerDayAvailabilityController.index,
);

export default router;
