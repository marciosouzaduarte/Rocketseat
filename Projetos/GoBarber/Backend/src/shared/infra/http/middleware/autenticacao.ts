import { Request, Response, NextFunction } from 'express';

import AppError from '@shared/errors/AppError';

import JWTProvider from '@shared/container/providers/TokenProvider/implementations/JWTProvider';

const jwtProvider = new JWTProvider();

interface ITokenPayload {
  sub: string;
}

export default async function autheticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('JWT not found', 401);
  }

  const [, token] = authorization.split(' ');

  try {
    const decodedToken = await jwtProvider.verify(token);

    const { sub } = decodedToken as ITokenPayload;

    request.user = { id: sub };

    return next();
  } catch (e) {
    throw new AppError('Invalid JWT', 401);
  }
}
