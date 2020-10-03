import ISendEmailMailProviderDTO from '../dtos/ISendEmailMailProviderDTO';

export default interface IMailProvider {
  sendEmail(data: ISendEmailMailProviderDTO): Promise<void>;
}
