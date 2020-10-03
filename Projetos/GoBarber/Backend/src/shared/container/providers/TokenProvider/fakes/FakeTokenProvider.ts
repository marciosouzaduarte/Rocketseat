import { sign, verify } from 'jsonwebtoken';
import dotenv from 'dotenv';

import ITokenProvider from '../models/ITokenProvider';

dotenv.config();

export default class JWTProvider implements ITokenProvider {
  public async sign(subject: string): Promise<string> {
    return sign({}, String(process.env.APP_HASH_TOKEN), {
      subject,
      expiresIn: '1d',
    });
  }

  public async verify(token: string): Promise<string | object> {
    return verify(token, String(process.env.APP_HASH_TOKEN));
  }
}
