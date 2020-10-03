import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';

interface IRequest {
  id: string;
}

@injectable()
export default class ShowUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<UsersModel> {
    const user = await this.usersRepository.findBydId(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const tempUser = Object.assign(user);

    delete tempUser.password;

    return tempUser;
  }
}
