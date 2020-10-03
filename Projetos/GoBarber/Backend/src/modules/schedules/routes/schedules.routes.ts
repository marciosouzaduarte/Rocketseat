import { Router } from 'express';

import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import SchedulesController from '../controllers/SchedulesController';

const router = Router();
const schedulesController = new SchedulesController();

// os acessos precisam ser autenticados
router.use(Autheticated);

router.post('/', schedulesController.create);
router.get('/', schedulesController.list);

export default router;
