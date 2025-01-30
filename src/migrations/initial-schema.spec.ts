import { describe, it, expect, vi } from 'vitest';
import { QueryRunner } from 'typeorm';
import { InitialSchema1710000000000 } from './1710000000000-initial-schema';

describe('Migration InitialSchema', () => {
  it('devrait créer et supprimer le schéma correctement', async () => {
    // Mock du QueryRunner
    const queryRunner = {
      query: vi.fn().mockImplementation((query: string) => {
        // Mock pour SELECT current_schema()
        if (query.includes('SELECT current_schema()')) {
          return [{ current_schema: 'test_migrations' }];
        }
        // Pour toutes les autres requêtes, retourner un succès
        return Promise.resolve();
      }),
    } as unknown as QueryRunner;

    // Spy sur la méthode query
    const querySpy = vi.spyOn(queryRunner, 'query');

    // Exécution de la migration up
    const migration = new InitialSchema1710000000000();
    await migration.up(queryRunner);

    // Vérification des appels pour la création des types enum
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TYPE'),
    );
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('user_role_enum'),
    );
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('student_level_enum'),
    );

    // Vérification des appels pour la création des tables
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TABLE'),
    );
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('users'));
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('students'));
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('instructors'),
    );
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('courses'));
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('modules'));
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('course_progress'),
    );
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('student_courses'),
    );

    // Vérification des appels pour la création des contraintes
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('FOREIGN KEY'),
    );
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('PRIMARY KEY'),
    );
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('UNIQUE'));

    // Vérification des appels pour la création des index
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('CREATE INDEX'),
    );
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('GIN'));

    // Vérification des appels pour la création des triggers
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('CREATE TRIGGER'),
    );
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('update_updated_at_column'),
    );

    // Reset du spy pour les tests de down
    querySpy.mockClear();

    // Exécution de la migration down
    await migration.down(queryRunner);

    // Vérification des appels pour la suppression des triggers
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('DROP TRIGGER'),
    );

    // Vérification des appels pour la suppression des tables
    expect(querySpy).toHaveBeenCalledWith(
      expect.stringContaining('DROP TABLE'),
    );

    // Vérification des appels pour la suppression des types enum
    expect(querySpy).toHaveBeenCalledWith(expect.stringContaining('DROP TYPE'));

    // Vérification de l'ordre des suppressions
    const dropCalls = querySpy.mock.calls
      .map(call => call[0] as string)
      .filter(query => query.includes('DROP TABLE'));

    // Vérifier que les tables sont supprimées dans le bon ordre
    const expectedOrder = [
      'student_courses',
      'course_progress',
      'modules',
      'courses',
      'instructors',
      'students',
      'users',
    ];

    expectedOrder.forEach((table, index) => {
      expect(dropCalls[index]).toContain(table);
    });
  });
});
