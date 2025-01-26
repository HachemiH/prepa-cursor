import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { CourseEntity } from './course.entity';
import { InstructorEntity } from '../../instructors/entities/instructor.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { getMetadataArgsStorage } from 'typeorm';

describe('CourseEntity', () => {
  const createValidInstructor = () => {
    const instructor = new InstructorEntity();
    const user = new UserEntity();
    user.email = 'instructor@example.com';
    user.password = 'Password1@';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.INSTRUCTOR;
    user.isActive = true;
    instructor.user = user;
    instructor.bio =
      "Une biographie détaillée de l'instructeur avec son expérience";
    instructor.expertise = ['JavaScript', 'TypeScript'];
    instructor.rating = 4.5;
    return instructor;
  };

  it('devrait créer une instance valide', async () => {
    const course = new CourseEntity();
    course.title = 'Introduction à TypeScript';
    course.description = 'Un cours complet sur TypeScript pour les débutants';
    course.instructor = createValidInstructor();
    course.isPublished = false;

    const errors = await validate(course);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      column => column.target === CourseEntity,
    );
    const columnNames = columns.map(column => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('isPublished');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const relations = metadata.relations.filter(
      relation => relation.target === CourseEntity,
    );
    const relationNames = relations.map(relation => relation.propertyName);

    expect(relationNames).toContain('instructor');
    expect(relationNames).toContain('students');
    expect(relationNames).toContain('modules');
  });

  describe('Validation du titre', () => {
    it('devrait rejeter un titre vide', async () => {
      const course = new CourseEntity();
      course.title = '';
      course.description = 'Un cours complet sur TypeScript';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeDefined();
      expect(titleError?.property).toBe('title');
    });

    it('devrait rejeter un titre trop court', async () => {
      const course = new CourseEntity();
      course.title = 'TS';
      course.description = 'Un cours complet sur TypeScript';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeDefined();
      expect(titleError?.property).toBe('title');
    });

    it('devrait accepter un titre valide', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = 'Un cours complet sur TypeScript';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeUndefined();
    });
  });

  describe('Validation de la description', () => {
    it('devrait rejeter une description vide', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = '';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError?.property).toBe('description');
    });

    it('devrait rejeter une description trop courte', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = 'Court';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError?.property).toBe('description');
    });

    it('devrait accepter une description valide', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = 'Un cours complet sur TypeScript pour les débutants';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeUndefined();
    });
  });

  describe("Validation de l'instructeur", () => {
    it('devrait rejeter un cours sans instructeur', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = 'Un cours complet sur TypeScript';
      course.isPublished = false;

      const errors = await validate(course);
      const instructorError = errors.find(
        error => error.property === 'instructor',
      );
      expect(instructorError).toBeDefined();
      expect(instructorError?.property).toBe('instructor');
    });

    it('devrait accepter un instructeur valide', async () => {
      const course = new CourseEntity();
      course.title = 'Introduction à TypeScript';
      course.description = 'Un cours complet sur TypeScript';
      course.instructor = createValidInstructor();
      course.isPublished = false;

      const errors = await validate(course);
      const instructorError = errors.find(
        error => error.property === 'instructor',
      );
      expect(instructorError).toBeUndefined();
    });
  });
});
