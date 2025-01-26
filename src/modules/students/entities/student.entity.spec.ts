import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { StudentEntity } from './student.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { StudentLevel } from '../enums/student-level.enum';
import { getMetadataArgsStorage } from 'typeorm';

describe('StudentEntity', () => {
  it('devrait créer une instance valide', async () => {
    const student = new StudentEntity();
    student.user = new UserEntity();
    student.level = StudentLevel.BEGINNER;
    student.bio = 'Une courte biographie';
    student.interests = ['JavaScript', 'TypeScript'];

    const errors = await validate(student);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      column => column.target === StudentEntity,
    );
    const columnNames = columns.map(column => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('level');
    expect(columnNames).toContain('bio');
    expect(columnNames).toContain('interests');
    expect(columnNames).toContain('lastLoginAt');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const relations = metadata.relations.filter(
      relation => relation.target === StudentEntity,
    );
    const relationNames = relations.map(relation => relation.propertyName);

    expect(relationNames).toContain('user');
  });

  describe('Validation du niveau', () => {
    it('devrait rejeter un niveau invalide', async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = 'INVALID_LEVEL' as StudentLevel;
      student.bio = 'Une courte biographie';
      student.interests = ['JavaScript'];

      const errors = await validate(student);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('level');
    });

    it('devrait accepter un niveau valide', async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = StudentLevel.INTERMEDIATE;
      student.bio = 'Une courte biographie';
      student.interests = ['JavaScript'];

      const errors = await validate(student);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Validation de la biographie', () => {
    it('devrait rejeter une biographie trop courte', async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = StudentLevel.BEGINNER;
      student.bio = 'Court';
      student.interests = ['JavaScript'];

      const errors = await validate(student);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('bio');
    });

    it('devrait accepter une biographie valide', async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = StudentLevel.BEGINNER;
      student.bio = 'Une biographie suffisamment longue pour être valide';
      student.interests = ['JavaScript'];

      const errors = await validate(student);
      expect(errors).toHaveLength(0);
    });
  });

  describe('Validation des intérêts', () => {
    it("devrait rejeter une liste vide d'intérêts", async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = StudentLevel.BEGINNER;
      student.bio = 'Une courte biographie';
      student.interests = [];

      const errors = await validate(student);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('interests');
    });

    it("devrait accepter une liste valide d'intérêts", async () => {
      const student = new StudentEntity();
      student.user = new UserEntity();
      student.level = StudentLevel.BEGINNER;
      student.bio = 'Une courte biographie';
      student.interests = ['JavaScript', 'TypeScript', 'Node.js'];

      const errors = await validate(student);
      expect(errors).toHaveLength(0);
    });
  });
});
