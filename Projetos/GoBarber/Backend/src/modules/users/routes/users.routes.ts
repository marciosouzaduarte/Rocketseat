import { Router } from 'express';
import multer from 'multer';

import avatarConfig from '@configs/uploadAvatar.config';
import Autheticated from '@shared/infra/http/middleware/authenticated.middleware';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

const router = Router();
const upload = multer(avatarConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

router.post('/', usersController.create);
router.get('/', usersController.list);

router.patch(
  '/avatar',
  Autheticated,
  upload.single('avatar'),
  userAvatarController.update,
);

export default router;
