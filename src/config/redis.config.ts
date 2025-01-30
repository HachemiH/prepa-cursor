import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { config } from 'dotenv';

config();

const {
  REDIS_HOST = 'localhost',
  REDIS_PORT = '6379',
  REDIS_PASSWORD = '',
  REDIS_DB = '0',
} = process.env;

const redisConfig: CacheModuleOptions = {
  store: redisStore,
  host: REDIS_HOST,
  port: parseInt(REDIS_PORT, 10),
  password: REDIS_PASSWORD || undefined,
  db: parseInt(REDIS_DB, 10),
  ttl: 60 * 60 * 24, // 24 heures par défaut
};

export default redisConfig;
