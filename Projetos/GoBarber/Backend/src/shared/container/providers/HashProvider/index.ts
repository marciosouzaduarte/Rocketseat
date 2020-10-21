import { container } from 'tsyringe';

import IHashProvider from './models/IHashProvider';
import BCryptHashProvider from './implementations/BCryptHashProvider';

const providers = {
  bcrypt: BCryptHashProvider,
};

container.registerSingleton<IHashProvider>('HashProvider', providers.bcrypt);
