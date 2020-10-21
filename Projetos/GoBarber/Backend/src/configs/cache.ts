import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: process.env.CACHE_DRIVER || 'redis',

  config: {
    redis: {
      host: process.env.REDIS_host,
      port: process.env.REDIS_port,
      password: process.env.REDIS_pass || undefined,
    },
  },
} as ICacheConfig;
