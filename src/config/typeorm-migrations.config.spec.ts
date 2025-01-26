import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataSource } from 'typeorm';
import dataSource from './typeorm-migrations.config';

describe('Configuration des Migrations TypeORM', () => {
  let testDataSource: DataSource;

  beforeAll(() => {
    testDataSource = dataSource;
  });

  afterAll(async () => {
    if (testDataSource && testDataSource.isInitialized) {
      await testDataSource.destroy();
    }
  });

  it('devrait avoir une configuration de base valide', () => {
    expect(testDataSource).toBeDefined();
    expect(testDataSource.options.type).toBe('postgres');
  });

  it('devrait avoir les chemins des migrations configurés correctement', () => {
    expect(testDataSource.options.migrations).toEqual(['src/migrations/*{.ts,.js}']);
  });

  it('devrait avoir les chemins des entités configurés correctement', () => {
    expect(testDataSource.options.entities).toEqual(['src/**/*.entity{.ts,.js}']);
  });

  it('devrait pouvoir se connecter à la base de données', async () => {
    await expect(testDataSource.initialize()).resolves.toBeDefined();
    expect(testDataSource.isInitialized).toBe(true);
  });

  it('devrait avoir les options de développement correctes', () => {
    expect(testDataSource.options.logging).toBe(process.env.NODE_ENV === 'development');
  });

  it('devrait avoir les variables d\'environnement correctement configurées', () => {
    const {
      host,
      port,
      username,
      password,
      database,
      schema,
    } = testDataSource.options as any;

    expect(host).toBe(process.env.DB_HOST || 'localhost');
    expect(port).toBe(parseInt(process.env.DB_PORT || '5432', 10));
    expect(username).toBe(process.env.DB_USERNAME || 'hachemi');
    expect(password).toBe(process.env.DB_PASSWORD || '');
    expect(database).toBe(process.env.DB_DATABASE || 'prepa_cursor_dev');
    expect(schema).toBe(process.env.DB_SCHEMA || 'public');
  });
}); 