import { DataSource, DataSourceOptions } from 'typeorm';
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

const dataSource = new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  schema: DB_SCHEMA,
  migrations: ['src/migrations/*{.ts,.js}'],
  entities: ['src/**/*.entity{.ts,.js}'],
  logging: NODE_ENV === 'development',
} as DataSourceOptions);

export default dataSource; 
