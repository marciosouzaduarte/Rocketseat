import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import ResetPasswordService from './ResetPasswordService';

interface INewUserInterface {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let userTest: INewUserInterface;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();

    fakeUsersRepository = new FakeUsersRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    resetPasswordService = new ResetPasswordService(
      fakeHashProvider,
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    userTest = {
      name: 'John Doe',
      email: 'john.doe@teste.com',
      password: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  it('Deve ser capaz de resetar a senha', async () => {
    const user = await fakeUsersRepository.insert(userTest);

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHashExecuted = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findBydId(user.id);

    expect(generateHashExecuted).toBeCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('Não deve ser capaz de resetar a senha sem um token', async () => {
    await expect(
      resetPasswordService.execute({
        password: '123123',
        token: 'token-não-existe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de resetar a senha sem um usuário', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'usuario-não-existe',
    );

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de resetar a senha com um token gerado a mais de duas horas', async () => {
    const user = await fakeUsersRepository.insert(userTest);

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPasswordService.execute({
        password: '123123',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
