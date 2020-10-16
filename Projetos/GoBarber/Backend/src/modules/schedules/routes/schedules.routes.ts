import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import SchedulesController from '../controllers/SchedulesController';
import ProviderSchedulesController from '../controllers/ProviderSchedulesController';

const router = Router();
const schedulesController = new SchedulesController();
const providerSchedulesController = new ProviderSchedulesController();

// os acessos precisam ser autenticados
router.use(Autheticated);

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date(),
    },
  }),
  schedulesController.create,
);
router.get('/', schedulesController.list);
router.get('/me', providerSchedulesController.index);

export default router;
