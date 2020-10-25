import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import { classToClass } from 'class-transformer';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<UsersModel> {
    const user = await this.usersRepository.findBydId(id);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkEmailUser = await this.usersRepository.findByEmail(email);

    if (checkEmailUser && checkEmailUser.id !== id) {
      throw new AppError('Email already in use');
    }

    if (password) {
      if (!old_password) {
        throw new AppError('Old password must be informed');
      }

      const compared = this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!compared) {
        throw new AppError('Old password is wrong');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    await this.usersRepository.update(user);

    return classToClass(user);
  }
}
