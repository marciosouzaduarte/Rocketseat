import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

interface INewUserInterface {
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

let fakeHashProvider: FakeHashProvider;
let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;
let userTeste: INewUserInterface;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createUserService = new CreateUserService(
      fakeHashProvider,
      fakeUsersRepository,
    );

    userTeste = {
      name: 'John Doe',
      email: 'john.doe@teste.com',
      password: '1234567890',
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  it('Deve ser capaz de atualizar um avatar de um usuário que existe', async () => {
    const user = await createUserService.execute(userTeste);

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'teste.jpg',
    });

    expect(user.avatar).toBe('teste.jpg');
  });

  it('Não eve ser capaz de atualizar um avatar de um usuário que existe', async () => {
    const updateUserAvatar = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    await expect(
      updateUserAvatar.execute({
        user_id: '1',
        avatar_filename: 'teste.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve ser capaz de deletar o avatar de um usuário ao informar um novo avatar', async () => {
    // escuta uma função de dentro do arquivo informado
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await createUserService.execute(userTeste);

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeStorageProvider,
      fakeUsersRepository,
    );

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'teste1.jpg',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatar_filename: 'teste2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('teste1.jpg');
    expect(user.avatar).toBe('teste2.jpg');
  });
});
