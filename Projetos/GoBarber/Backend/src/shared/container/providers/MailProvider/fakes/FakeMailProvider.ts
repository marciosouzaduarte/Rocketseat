import IMailProvider from '../models/IMailProvider';
import ISendEmailMailProviderDTO from '../dtos/ISendEmailMailProviderDTO';

export default class FakeMailProvider implements IMailProvider {
  private message: ISendEmailMailProviderDTO[] = [];

  public async sendEmail(data: ISendEmailMailProviderDTO): Promise<void> {
    this.message.push(data);
  }
}
