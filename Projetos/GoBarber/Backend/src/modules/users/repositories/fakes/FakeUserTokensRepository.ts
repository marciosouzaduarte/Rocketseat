import { v4 } from 'uuid';

import UserTokensModel from '@models/UserTokensModel';
import IUserTokensRepository from '@modules/users/repositories/interfaces/IUserTokensRepository';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private usersToken: UserTokensModel[] = [];

  public async generate(user_id: string): Promise<UserTokensModel> {
    const userToken = new UserTokensModel();

    Object.assign(userToken, {
      id: v4(),
      token: v4(),
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    });

    this.usersToken.push(userToken);

    return userToken;
  }

  public async findByToken(
    token: string,
  ): Promise<UserTokensModel | undefined> {
    const user = this.usersToken.find(u => u.token === token);
    return user;
  }
}
