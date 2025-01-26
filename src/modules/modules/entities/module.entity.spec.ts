import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { ModuleEntity } from './module.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
import { InstructorEntity } from '../../instructors/entities/instructor.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { getMetadataArgsStorage } from 'typeorm';

describe('ModuleEntity', () => {
  const createValidCourse = () => {
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
    return course;
  };

  it('devrait créer une instance valide', async () => {
    const module = new ModuleEntity();
    module.title = 'Introduction aux Types';
    module.description = 'Découvrez les types de base en TypeScript';
    module.course = createValidCourse();
    module.order = 1;
    module.content =
      'Contenu détaillé du module sur les types de base en TypeScript';

    const errors = await validate(module);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      column => column.target === ModuleEntity,
    );
    const columnNames = columns.map(column => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('title');
    expect(columnNames).toContain('description');
    expect(columnNames).toContain('order');
    expect(columnNames).toContain('content');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const relations = metadata.relations.filter(
      relation => relation.target === ModuleEntity,
    );
    const relationNames = relations.map(relation => relation.propertyName);

    expect(relationNames).toContain('course');
  });

  describe('Validation du titre', () => {
    it('devrait rejeter un titre vide', async () => {
      const module = new ModuleEntity();
      module.title = '';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeDefined();
      expect(titleError?.property).toBe('title');
    });

    it('devrait rejeter un titre trop court', async () => {
      const module = new ModuleEntity();
      module.title = 'TS';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeDefined();
      expect(titleError?.property).toBe('title');
    });

    it('devrait accepter un titre valide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const titleError = errors.find(error => error.property === 'title');
      expect(titleError).toBeUndefined();
    });
  });

  describe('Validation de la description', () => {
    it('devrait rejeter une description vide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = '';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError?.property).toBe('description');
    });

    it('devrait rejeter une description trop courte', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Court';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeDefined();
      expect(descriptionError?.property).toBe('description');
    });

    it('devrait accepter une description valide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const descriptionError = errors.find(
        error => error.property === 'description',
      );
      expect(descriptionError).toBeUndefined();
    });
  });

  describe('Validation du cours', () => {
    it('devrait rejeter un module sans cours', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const courseError = errors.find(error => error.property === 'course');
      expect(courseError).toBeDefined();
      expect(courseError?.property).toBe('course');
    });

    it('devrait accepter un cours valide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const courseError = errors.find(error => error.property === 'course');
      expect(courseError).toBeUndefined();
    });
  });

  describe("Validation de l'ordre", () => {
    it('devrait rejeter un ordre négatif', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = -1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const orderError = errors.find(error => error.property === 'order');
      expect(orderError).toBeDefined();
      expect(orderError?.property).toBe('order');
    });

    it('devrait accepter un ordre valide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Contenu détaillé du module';

      const errors = await validate(module);
      const orderError = errors.find(error => error.property === 'order');
      expect(orderError).toBeUndefined();
    });
  });

  describe('Validation du contenu', () => {
    it('devrait rejeter un contenu vide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = '';

      const errors = await validate(module);
      const contentError = errors.find(error => error.property === 'content');
      expect(contentError).toBeDefined();
      expect(contentError?.property).toBe('content');
    });

    it('devrait rejeter un contenu trop court', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content = 'Court';

      const errors = await validate(module);
      const contentError = errors.find(error => error.property === 'content');
      expect(contentError).toBeDefined();
      expect(contentError?.property).toBe('content');
    });

    it('devrait accepter un contenu valide', async () => {
      const module = new ModuleEntity();
      module.title = 'Introduction aux Types';
      module.description = 'Découvrez les types de base en TypeScript';
      module.course = createValidCourse();
      module.order = 1;
      module.content =
        'Contenu détaillé du module sur les types de base en TypeScript';

      const errors = await validate(module);
      const contentError = errors.find(error => error.property === 'content');
      expect(contentError).toBeUndefined();
    });
  });
});
