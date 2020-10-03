import IParserMailTemplateProviderDTO from '../dtos/IParserMailTemplateProviderDTO';

export default interface IMailTemplateProvider {
  parser(data: IParserMailTemplateProviderDTO): Promise<string>;
}
