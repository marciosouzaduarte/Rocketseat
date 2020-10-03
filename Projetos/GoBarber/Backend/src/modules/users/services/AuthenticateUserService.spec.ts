import AppError from '@shared/errors/AppError';

import FakeTokenProvider from '@shared/container/providers/TokenProvider/fakes/FakeTokenProvider';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

interface INewUserInterface {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

let fakeTokenProvider: FakeTokenProvider;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;

let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;
let userTest: INewUserInterface;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();

    fakeTokenProvider = new FakeTokenProvider();

    fakeUsersRepository = new FakeUsersRepository();

    createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    authenticateUserService = new AuthenticateUserService(
      fakeTokenProvider,
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

  it('Deve ser capaz de autenticar um usuário', async () => {
    await createUserService.execute(userTest);

    const response = await authenticateUserService.execute(userTest);

    expect(response).toHaveProperty('token');
  });

  it('Não deve ser capaz de autenticar um usuário inválido', async () => {
    await expect(
      authenticateUserService.execute(userTest),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de autenticar um usuário com senha errada', async () => {
    await createUserService.execute(userTest);

    const testedPassword = '12345678901234567890';

    await expect(
      authenticateUserService.execute({
        email: userTest.email,
        password: testedPassword,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
