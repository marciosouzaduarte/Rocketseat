import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import cacheConfig from '@configs/cache';
import AppError from '@shared/errors/AppError';

const redisClient = new Redis({
  ...cacheConfig.config.redis,
  enableOfflineQueue: false,
});

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'middleware-limiter',
  points: 5,
  duration: 1,
});

export default async function limiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await rateLimiter.consume(request.ip, 1);
    return next();
  } catch (e) {
    throw new AppError('Too Many Requests', 429);
  }
}
