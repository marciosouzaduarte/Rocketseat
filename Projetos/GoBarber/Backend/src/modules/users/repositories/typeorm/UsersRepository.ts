import { getRepository, Repository } from 'typeorm';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<UsersModel>;

  constructor() {
    this.ormRepository = getRepository(UsersModel);
  }

  public async findBydId(id: string): Promise<UsersModel | undefined> {
    const findInfo = await this.ormRepository.findOne(id);
    return findInfo;
  }

  public async findByEmail(email: string): Promise<UsersModel | undefined> {
    const findInfo = await this.ormRepository.findOne({
      where: { email },
    });

    return findInfo;
  }

  public async findAll(): Promise<UsersModel[]> {
    const findInfo = await this.ormRepository.find();
    return findInfo;
  }

  public async insert({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<UsersModel> {
    const dataToSave = this.ormRepository.create({
      name,
      email,
      password,
    });

    await this.ormRepository.save(dataToSave);

    return dataToSave;
  }

  public async update(user: UsersModel): Promise<UsersModel> {
    return this.ormRepository.save(user);
  }
}
