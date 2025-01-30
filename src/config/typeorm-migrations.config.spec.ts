import { describe, it, expect } from 'vitest';
import typeormMigrationsConfig from './typeorm-migrations.config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

describe('TypeORM Migrations Config', () => {
  const config = typeormMigrationsConfig.options as PostgresConnectionOptions;

  it('devrait avoir la configuration de base correcte', () => {
    expect(config.type).toBe('postgres');
    expect(config.host).toBe('localhost');
    expect(config.port).toBe(5432);
    expect(config.username).toBe('hachemi');
    expect(config.password).toBe('');
    expect(config.database).toBe('prepa_cursor_dev');
    expect(config.schema).toBe('public');
  });

  it('devrait avoir les chemins de migration corrects', () => {
    expect(config.migrations).toEqual(['src/migrations/*{.ts,.js}']);
  });

  it('devrait avoir les entités correctes', () => {
    expect(Array.isArray(config.entities)).toBe(true);
    expect(config.entities?.length).toBeGreaterThan(0);
  });

  it('devrait avoir le logging désactivé en production', () => {
    expect(config.logging).toBe(false);
  });

  it('devrait être une configuration PostgreSQL valide', () => {
    expect(config.type).toBe('postgres');
  });
});
