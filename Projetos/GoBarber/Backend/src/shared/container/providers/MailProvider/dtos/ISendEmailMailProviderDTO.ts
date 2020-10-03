import IParserMailTemplateProviderDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParserMailTemplateProviderDTO';

interface IMailContac {
  name: string;
  email: string;
}

export default interface ISendEmailMailProviderDTO {
  from?: IMailContac;
  to: IMailContac;
  bcc?: IMailContac;
  subject: string;
  template: IParserMailTemplateProviderDTO;
}
