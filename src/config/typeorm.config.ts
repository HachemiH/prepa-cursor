/**
 * Configuration TypeORM pour la connexion à la base de données PostgreSQL
 * 
 * Cette configuration est utilisée par le module TypeORM de NestJS pour :
 * - Établir la connexion à la base de données
 * - Gérer les entités et leurs relations
 * - Exécuter les migrations
 * 
 * Variables d'environnement requises :
 * - DB_HOST : Hôte de la base de données (défaut: localhost)
 * - DB_PORT : Port de la base de données (défaut: 5432)
 * - DB_USERNAME : Nom d'utilisateur (défaut: hachemi)
 * - DB_PASSWORD : Mot de passe (défaut: '')
 * - DB_DATABASE : Nom de la base de données (défaut: prepa_cursor_dev)
 * - DB_SCHEMA : Schéma de la base de données (défaut: public)
 * - NODE_ENV : Environnement d'exécution (défaut: development)
 * 
 * En mode développement (NODE_ENV=development) :
 * - synchronize: true (ATTENTION: à désactiver en production)
 * - logging: true (logs SQL activés)
 * 
 * Chemins des fichiers :
 * - Entités : "dist/**\/*.entity.{ts,js}"
 * - Migrations : "dist/migrations/*.{ts,js}"
 */

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