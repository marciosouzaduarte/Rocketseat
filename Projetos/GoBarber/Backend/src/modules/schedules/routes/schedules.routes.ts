import { Router } from 'express';

import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import SchedulesController from '../controllers/SchedulesController';
import ProviderSchedulesController from '../controllers/ProviderSchedulesController';

const router = Router();
const schedulesController = new SchedulesController();
const providerSchedulesController = new ProviderSchedulesController();

// os acessos precisam ser autenticados
router.use(Autheticated);

router.post('/', schedulesController.create);
router.get('/', schedulesController.list);
router.get('/me', providerSchedulesController.index);

export default router;
