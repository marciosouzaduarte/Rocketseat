import { hash, compare } from 'bcryptjs';
import dotenv from 'dotenv';

import IHashProvider from '../models/IHashProvider';

dotenv.config();

export default class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, String(process.env.APP_HASH));
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
