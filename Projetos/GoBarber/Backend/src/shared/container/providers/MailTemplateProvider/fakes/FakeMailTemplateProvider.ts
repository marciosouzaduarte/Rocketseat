import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parser(): Promise<string> {
    return 'file';
  }
}

export default FakeMailTemplateProvider;
