import { describe, it, expect } from 'vitest';
import { TestController } from './test.controller';

describe('TestController', () => {
  const controller = new TestController();

  describe('Routes publiques', () => {
    it('devrait retourner un message pour la route publique', () => {
      const result = controller.getPublic();
      expect(result).toEqual({ message: 'Cette route est publique' });
    });
  });

  describe('Routes protégées', () => {
    it('devrait retourner un message pour la route admin', () => {
      const result = controller.getAdmin();
      expect(result).toEqual({ message: 'Cette route est réservée aux admins' });
    });

    it('devrait retourner un message pour la route instructeur', () => {
      const result = controller.getInstructor();
      expect(result).toEqual({ message: 'Cette route est réservée aux instructeurs' });
    });

    it('devrait retourner un message pour la route étudiant', () => {
      const result = controller.getStudent();
      expect(result).toEqual({ message: 'Cette route est réservée aux étudiants' });
    });

    it('devrait retourner un message pour la route instructeur/admin', () => {
      const result = controller.getInstructorOrAdmin();
      expect(result).toEqual({ message: 'Cette route est réservée aux instructeurs et admins' });
    });
  });
}); 