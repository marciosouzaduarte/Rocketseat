import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHashProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHashProvider';

import ITokenProvider from './TokenProvider/models/ITokenProvider';
import JWTProvider from './TokenProvider/implementations/JWTProvider';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerInstance<IHashProvider>(
  'HashProvider',
  new BCryptHashProvider(),
);

container.registerInstance<ITokenProvider>('TokenProvider', new JWTProvider());

container.registerInstance<IStorageProvider>(
  'StorageProvider',
  new DiskStorageProvider(),
);

container.registerInstance<IMailTemplateProvider>(
  'MailTemplateProvider',
  new HandlebarsMailTemplateProvider(),
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);
