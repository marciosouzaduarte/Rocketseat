import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '@modules/users/repositories/interfaces/IUsersRepository';
import IUserTokensRepository from '../repositories/interfaces/IUserTokensRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
export default class SendForgotPasswordService {
  constructor(
    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ email }: IRequestDTO): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPawsswordTemplate = path.resolve(
      __dirname,
      '..',
      'templates',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendEmail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[GoBarber] - Recuperação de Senha',
      template: {
        file: forgotPawsswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset_passwords?token=${token}`,
        },
      },
    });
  }
}
