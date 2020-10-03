import UserTokensModel from '@models/UserTokensModel';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserTokensModel>;
  findByToken(token: string): Promise<UserTokensModel | undefined>;
}
