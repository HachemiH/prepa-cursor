import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USERNAME = 'hachemi',
  DB_PASSWORD = '',
  DB_DATABASE = 'prepa_cursor_dev',
  DB_SCHEMA = 'public',
  NODE_ENV = 'development',
} = process.env;

const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  schema: DB_SCHEMA,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: NODE_ENV === 'development',
  logging: NODE_ENV === 'development',
};

export default typeormConfig; 