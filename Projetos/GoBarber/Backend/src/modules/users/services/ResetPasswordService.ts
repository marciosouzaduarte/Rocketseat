import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/interfaces/IUserTokensRepository';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IRequestDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User/Token not found');
    }

    const user = await this.usersRepository.findBydId(userToken.user_id);

    if (!user) {
      throw new AppError('User not exist');
    }

    const tokenCreatedAt = userToken.created_at;

    if (Math.abs(differenceInHours(tokenCreatedAt, Date.now())) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);
  }
}
