import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordService from './SendForgotPasswordService';

interface INewUserInterface {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}
let fakeMailProvider: FakeMailProvider;

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;

let sendForgotPasswordService: SendForgotPasswordService;
let userTest: INewUserInterface;

describe('SendForgotPassword', () => {
  beforeEach(() => {
    fakeMailProvider = new FakeMailProvider();

    fakeUsersRepository = new FakeUsersRepository();

    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordService = new SendForgotPasswordService(
      fakeMailProvider,
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

  it('Deve ser capaz de recuperar a senha informando o email', async () => {
    const sendedEmail = jest.spyOn(fakeMailProvider, 'sendEmail');

    const user = await fakeUsersRepository.insert(userTest);

    await sendForgotPasswordService.execute({ email: user.email });

    expect(sendedEmail).toHaveBeenCalled();
  });

  it('Deve ser capaz de gerar um token de recuperação', async () => {
    const generatedToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.insert(userTest);

    await sendForgotPasswordService.execute({ email: user.email });

    expect(generatedToken).toHaveBeenCalledWith(user.id);
  });

  it('Não deve ser capaz de recuperar a senha de um email/usuário que não existe', async () => {
    await expect(
      sendForgotPasswordService.execute({ email: userTest.email }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
