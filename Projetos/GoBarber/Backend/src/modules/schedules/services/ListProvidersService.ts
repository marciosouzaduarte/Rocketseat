import { injectable, inject } from 'tsyringe';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
export default class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<UsersModel[]> {
    const users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    return users;
  }
}
