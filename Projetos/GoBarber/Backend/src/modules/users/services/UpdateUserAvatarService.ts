import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import UsersModel from '@models/UsersModel';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import IUpdateUserAvatarDTO from '@modules/users/dtos/IUpdateUserAvatarDTO';

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    avatar_filename,
  }: IUpdateUserAvatarDTO): Promise<UsersModel> {
    const user = await this.usersRepository.findBydId(user_id);

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatar_filename);

    user.avatar = filename;

    await this.usersRepository.update(user);

    const tempUser = Object.assign(user);

    delete tempUser.password;

    return tempUser;
  }
}
