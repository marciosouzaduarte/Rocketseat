import { injectable, inject } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';
import mailConfig from '@configs/mail';

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendEmailMailProviderDTO from '../dtos/ISendEmailMailProviderDTO';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    const createAccount = async () => {
      const account = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    };

    createAccount();
  }

  public async sendEmail({
    from,
    to,
    bcc,
    subject,
    template,
  }: ISendEmailMailProviderDTO): Promise<void> {
    const sendedEmail = await this.client.sendMail({
      from: {
        name: from?.name || mailConfig.defaults.from.name,
        address: from?.email || mailConfig.defaults.from.email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      bcc: {
        name: bcc?.name || '',
        address: bcc?.email || '',
      },
      subject,
      html: await this.mailTemplateProvider.parser(template),
    });

    // eslint-disable-next-line no-console
    console.log(nodemailer.getTestMessageUrl(sendedEmail));
  }
}
