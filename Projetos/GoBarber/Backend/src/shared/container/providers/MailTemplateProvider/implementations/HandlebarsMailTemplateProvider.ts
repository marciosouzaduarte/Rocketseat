import fs from 'fs';
import handlebars from 'handlebars';

import IParserMailTemplateProviderDTO from '../dtos/IParserMailTemplateProviderDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parser({
    file,
    variables,
  }: IParserMailTemplateProviderDTO): Promise<string> {
    const templateFile = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });

    const parsedTemplate = handlebars.compile(templateFile);

    return parsedTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
