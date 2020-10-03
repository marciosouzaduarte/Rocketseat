import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';

const GlobalError = (
  err: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response => {
  // eslint-disable-next-line
  console.error(err);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default GlobalError;
