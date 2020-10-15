import UserModel from '@models/UsersModel';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

// CRUDS
export default interface IUsersRepository {
  insert(data: ICreateUserDTO): Promise<UserModel>;
  update(user: UserModel): Promise<UserModel>;

  // show / list
  findAll(): Promise<UserModel[]>;
  findBydId(id: string): Promise<UserModel | undefined>;
  findByEmail(email: string): Promise<UserModel | undefined>;
  findAllProviders(data: IFindAllProvidersDTO): Promise<UserModel[]>;
}
