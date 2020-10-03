import UserModel from '@models/UsersModel';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

// CRUDS
export default interface IUsersRepository {
  insert(data: ICreateUserDTO): Promise<UserModel>;
  update(user: UserModel): Promise<UserModel>;

  // show / list
  findAll(): Promise<UserModel[]>;
  findBydId(id: string): Promise<UserModel | undefined>;
  findByEmail(email: string): Promise<UserModel | undefined>;
}
