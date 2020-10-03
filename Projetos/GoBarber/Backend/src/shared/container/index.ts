import { container } from 'tsyringe';

import '@shared/container/providers';

import ISchedulesRepository from '@modules/schedules/repositories/interfaces/ISchedulesRepository';
import SchedulesRepository from '@modules/schedules/repositories/typeorm/SchedulesRepository';

import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import UsersRepository from '@modules/users/repositories/typeorm/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/interfaces/IUserTokensRepository';
import UserTokensRepository from '@modules/users/repositories/typeorm/UserTokensRepository';

container.registerSingleton<ISchedulesRepository>(
  'SchedulesRepository',
  SchedulesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
