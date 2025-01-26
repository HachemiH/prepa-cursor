import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { InstructorEntity } from './instructor.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { UserRole } from '../../users/enums/user-role.enum';
import { getMetadataArgsStorage } from 'typeorm';

describe('InstructorEntity', () => {
  const createValidUser = () => {
    const user = new UserEntity();
    user.email = 'instructor@example.com';
    user.password = 'Password1@';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.INSTRUCTOR;
    user.isActive = true;
    return user;
  };

  it('devrait créer une instance valide', async () => {
    const instructor = new InstructorEntity();
    instructor.user = createValidUser();
    instructor.bio =
      "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
    instructor.expertise = ['JavaScript', 'TypeScript', 'Node.js'];
    instructor.rating = 4.5;

    const errors = await validate(instructor);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const metadata = getMetadataArgsStorage();
    const columns = metadata.columns.filter(
      column => column.target === InstructorEntity,
    );
    const columnNames = columns.map(column => column.propertyName);

    expect(columnNames).toContain('id');
    expect(columnNames).toContain('bio');
    expect(columnNames).toContain('expertise');
    expect(columnNames).toContain('rating');
    expect(columnNames).toContain('createdAt');
    expect(columnNames).toContain('updatedAt');

    const relations = metadata.relations.filter(
      relation => relation.target === InstructorEntity,
    );
    const relationNames = relations.map(relation => relation.propertyName);

    expect(relationNames).toContain('user');
    expect(relationNames).toContain('courses');
  });

  describe('Validation de la biographie', () => {
    it('devrait rejeter une biographie trop courte', async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio = 'Trop court';
      instructor.expertise = ['JavaScript'];
      instructor.rating = 4.5;

      const errors = await validate(instructor);
      const bioError = errors.find(error => error.property === 'bio');
      expect(bioError).toBeDefined();
      expect(bioError?.property).toBe('bio');
    });

    it('devrait accepter une biographie valide', async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = ['JavaScript'];
      instructor.rating = 4.5;

      const errors = await validate(instructor);
      const bioError = errors.find(error => error.property === 'bio');
      expect(bioError).toBeUndefined();
    });
  });

  describe("Validation de l'expertise", () => {
    it("devrait rejeter une liste vide d'expertise", async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = [];
      instructor.rating = 4.5;

      const errors = await validate(instructor);
      const expertiseError = errors.find(
        error => error.property === 'expertise',
      );
      expect(expertiseError).toBeDefined();
      expect(expertiseError?.property).toBe('expertise');
    });

    it("devrait accepter une liste valide d'expertise", async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = ['JavaScript', 'TypeScript', 'Node.js'];
      instructor.rating = 4.5;

      const errors = await validate(instructor);
      const expertiseError = errors.find(
        error => error.property === 'expertise',
      );
      expect(expertiseError).toBeUndefined();
    });
  });

  describe('Validation de la note', () => {
    it('devrait rejeter une note inférieure à 0', async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = ['JavaScript'];
      instructor.rating = -1;

      const errors = await validate(instructor);
      const ratingError = errors.find(error => error.property === 'rating');
      expect(ratingError).toBeDefined();
      expect(ratingError?.property).toBe('rating');
    });

    it('devrait rejeter une note supérieure à 5', async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = ['JavaScript'];
      instructor.rating = 5.1;

      const errors = await validate(instructor);
      const ratingError = errors.find(error => error.property === 'rating');
      expect(ratingError).toBeDefined();
      expect(ratingError?.property).toBe('rating');
    });

    it('devrait accepter une note valide', async () => {
      const instructor = new InstructorEntity();
      instructor.user = createValidUser();
      instructor.bio =
        "Une biographie détaillée de l'instructeur avec son expérience professionnelle, ses compétences techniques et son parcours académique. Il a travaillé sur de nombreux projets et a acquis une expertise solide dans le développement web.";
      instructor.expertise = ['JavaScript'];
      instructor.rating = 4.5;

      const errors = await validate(instructor);
      const ratingError = errors.find(error => error.property === 'rating');
      expect(ratingError).toBeUndefined();
    });
  });
});
