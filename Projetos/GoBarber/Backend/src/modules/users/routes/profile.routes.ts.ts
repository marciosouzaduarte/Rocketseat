import { Router } from 'express';

import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import ProfileController from '../controllers/ProfileController';

const router = Router();
const profileController = new ProfileController();

// todas as rotas precisarão de autenticação
router.use(Autheticated);

router.put('/', profileController.update);
router.get('/', profileController.show);

export default router;
