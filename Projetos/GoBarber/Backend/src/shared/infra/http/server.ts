import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { errors as CelebrateErrors } from 'celebrate';

import 'express-async-errors';

import GlobalError from '@shared/errors/GlobalError';
import avatarConfig from '@configs/uploadAvatar.config';

import '@shared/infra/database';
import '@shared/container';

import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());

// local estático para acesso dos arquivos
app.use('/files', express.static(avatarConfig.uploadsFolder));

// rotas utilizadas
app.use(routes);

app.use(CelebrateErrors());
app.use(GlobalError);

const port = process.env.APP_PORT || 3333;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`API ${process.env.APP_NAME} iniciada na porta ${port}!`);
});
