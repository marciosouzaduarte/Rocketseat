import { container } from 'tsyringe';

import ITokenProvider from './models/ITokenProvider';
import JWTProvider from './implementations/JWTProvider';

const providers = {
  jwt: JWTProvider,
};

container.registerSingleton<ITokenProvider>('TokenProvider', providers.jwt);
