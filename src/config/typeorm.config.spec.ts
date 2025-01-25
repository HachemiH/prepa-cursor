import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataSource, DataSourceOptions } from 'typeorm';
import typeormConfig from './typeorm.config';

describe('TypeORM Configuration', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'hachemi',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'prepa_cursor_dev',
      schema: process.env.DB_SCHEMA || 'public',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/migrations/*{.ts,.js}'],
    } as DataSourceOptions);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('devrait avoir une configuration valide', () => {
    expect(typeormConfig).toBeDefined();
    expect(typeormConfig.type).toBe('postgres');
  });

  it('devrait avoir les chemins des entités et migrations configurés', () => {
    expect(typeormConfig.entities).toEqual(['dist/**/*.entity{.ts,.js}']);
    expect(typeormConfig.migrations).toEqual(['dist/migrations/*{.ts,.js}']);
  });

  it('devrait pouvoir se connecter à la base de données', async () => {
    await expect(dataSource.initialize()).resolves.toBeDefined();
    expect(dataSource.isInitialized).toBe(true);
  });

  it('devrait avoir les bonnes options en mode développement', () => {
    if (process.env.NODE_ENV === 'development') {
      expect(typeormConfig.synchronize).toBe(true);
      expect(typeormConfig.logging).toBe(true);
    } else {
      expect(typeormConfig.synchronize).toBe(false);
      expect(typeormConfig.logging).toBe(false);
    }
  });
}); 