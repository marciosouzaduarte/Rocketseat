import { getRepository, Repository } from 'typeorm';

import UserTokensModel from '@models/UserTokensModel';
import IUserTokensRepository from '@modules/users/repositories/interfaces/IUserTokensRepository';

export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokensModel>;

  constructor() {
    this.ormRepository = getRepository(UserTokensModel);
  }

  public async generate(user_id: string): Promise<UserTokensModel> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(
    token: string,
  ): Promise<UserTokensModel | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });

    return userToken;
  }
}
