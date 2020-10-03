import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

interface INewUserInterface {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;

let createUserService: CreateUserService;
let userTest: INewUserInterface;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();

    fakeUsersRepository = new FakeUsersRepository();

    createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    userTest = {
      name: 'John Doe',
      email: 'john.doe@teste.com',
      password: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  it('Deve ser capaz de criar um novo usuário', async () => {
    const user = await createUserService.execute(userTest);

    expect(user).toHaveProperty('id');
    expect(user.name).toBe(userTest.name);
  });

  it('Não deve ser capaz de criar dois usuários com o email repetido', async () => {
    await createUserService.execute(userTest);

    await expect(createUserService.execute(userTest)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
