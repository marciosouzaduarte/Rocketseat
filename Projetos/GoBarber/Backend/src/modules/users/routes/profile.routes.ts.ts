import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import autheticated from '@shared/infra/http/middleware/autenticacao';

import ProfileController from '../controllers/ProfileController';

const router = Router();
const profileController = new ProfileController();

// todas as rotas precisarão de autenticação
router.use(autheticated);

router.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  profileController.update,
);
router.get('/', profileController.show);

export default router;
