import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CourseProgressEntity } from './course-progress.entity';
import { StudentEntity } from '../../students/entities/student.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { CourseEntity } from '../../courses/entities/course.entity';
import { InstructorEntity } from '../../instructors/entities/instructor.entity';
import { getMetadataArgsStorage } from 'typeorm';

describe('CourseProgressEntity', () => {
  const createValidStudent = () => {
    const student = new StudentEntity();
    const user = new UserEntity();
    user.email = 'student@example.com';
    user.password = 'Password1@';
    user.firstName = 'Jane';
    user.lastName = 'Doe';
    user.role = UserRole.STUDENT;
    user.isActive = true;
    student.user = user;
    student.lastLoginAt = new Date();
    return student;
  };

  const createValidModule = () => {
    const module = new ModuleEntity();
    module.title = 'Introduction aux Types';
    module.description = 'Découvrez les types de base en TypeScript';

    const course = new CourseEntity();
    course.title = 'Introduction à TypeScript';
    course.description = 'Un cours complet sur TypeScript pour les débutants';

    const instructor = new InstructorEntity();
    const user = new UserEntity();
    user.email = 'instructor@example.com';
    user.password = 'Password1@';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.INSTRUCTOR;
    user.isActive = true;
    instructor.user = user;
    instructor.bio = "Une biographie détaillée de l'instructeur";
    instructor.expertise = ['JavaScript', 'TypeScript'];
    instructor.rating = 4.5;

    course.instructor = instructor;
    course.isPublished = false;

    module.course = course;
    module.order = 1;
    module.content =
      'Contenu détaillé du module sur les types de base en TypeScript';

    return module;
  };

  it('devrait créer une instance valide', async () => {
    const progress = new CourseProgressEntity();
    progress.student = createValidStudent();
    progress.module = createValidModule();
    progress.completed = false;

    const errors = await validate(progress);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      column => column.target === CourseProgressEntity,
    );
    const columnNames = columns.map(column => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('completed');
    expect(columnNames).toContain('completedAt');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const relations = metadata.relations.filter(
      relation => relation.target === CourseProgressEntity,
    );
    const relationNames = relations.map(relation => relation.propertyName);

    expect(relationNames).toContain('student');
    expect(relationNames).toContain('module');
  });

  describe("Validation de l'étudiant", () => {
    it('devrait rejeter une progression sans étudiant', async () => {
      const progress = new CourseProgressEntity();
      progress.module = createValidModule();
      progress.completed = false;

      const errors = await validate(progress);
      const studentError = errors.find(error => error.property === 'student');
      expect(studentError).toBeDefined();
      expect(studentError?.property).toBe('student');
    });

    it('devrait accepter un étudiant valide', async () => {
      const progress = new CourseProgressEntity();
      progress.student = createValidStudent();
      progress.module = createValidModule();
      progress.completed = false;

      const errors = await validate(progress);
      const studentError = errors.find(error => error.property === 'student');
      expect(studentError).toBeUndefined();
    });
  });

  describe('Validation du module', () => {
    it('devrait rejeter une progression sans module', async () => {
      const progress = new CourseProgressEntity();
      progress.student = createValidStudent();
      progress.completed = false;

      const errors = await validate(progress);
      const moduleError = errors.find(error => error.property === 'module');
      expect(moduleError).toBeDefined();
      expect(moduleError?.property).toBe('module');
    });

    it('devrait accepter un module valide', async () => {
      const progress = new CourseProgressEntity();
      progress.student = createValidStudent();
      progress.module = createValidModule();
      progress.completed = false;

      const errors = await validate(progress);
      const moduleError = errors.find(error => error.property === 'module');
      expect(moduleError).toBeUndefined();
    });
  });

  describe('Validation de la complétion', () => {
    it('devrait avoir completedAt défini quand completed est true', async () => {
      const progress = new CourseProgressEntity();
      progress.student = createValidStudent();
      progress.module = createValidModule();
      progress.completed = true;
      progress.completedAt = new Date();

      const errors = await validate(progress);
      expect(errors).toHaveLength(0);
    });

    it('devrait avoir completedAt non défini quand completed est false', async () => {
      const progress = new CourseProgressEntity();
      progress.student = createValidStudent();
      progress.module = createValidModule();
      progress.completed = false;
      progress.completedAt = undefined;

      const errors = await validate(progress);
      expect(errors).toHaveLength(0);
    });
  });
});
