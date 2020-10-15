import { v4 } from 'uuid';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

export default class FakeUsersRepository implements IUsersRepository {
  private users: UsersModel[] = [];

  public async findBydId(id: string): Promise<UsersModel | undefined> {
    return this.users.find(user => user.id === id);
  }

  public async findByEmail(email: string): Promise<UsersModel | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findAll(): Promise<UsersModel[]> {
    return this.users;
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<UsersModel[]> {
    let { users } = this;

    if (except_user_id) {
      users = this.users.filter(user => user.id !== except_user_id);
    }

    return users;
  }

  public async insert({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<UsersModel> {
    const user = new UsersModel();

    Object.assign(user, { id: v4() }, { name, email, password });

    this.users.push(user);

    return user;
  }

  public async update(user: UsersModel): Promise<UsersModel> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}
