import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ITokenProvider from '@shared/container/providers/TokenProvider/models/ITokenProvider';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import IAuthenticateUserDTO from '@modules/users/dtos/IAuthenticateUserDTO';

@injectable()
export default class AuthenticateUserService {
  constructor(
    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<{
    user: UsersModel;
    token: string;
  }> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('User not found', 401);
    }

    const token = await this.tokenProvider.sign(user.id);

    return { user, token };
  }
}
