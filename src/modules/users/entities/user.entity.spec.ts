import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { UserEntity } from './user.entity';
import { UserRole } from '../enums/user-role.enum';

describe('UserEntity', () => {
  it('devrait créer une instance valide avec tous les champs requis', async () => {
    const user = new UserEntity();
    user.email = 'test@example.com';
    user.password = 'Password123!';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.role = UserRole.STUDENT;
    user.isActive = true;
    user.isSuperAdmin = false;

    const errors = await validate(user);
    expect(errors).toHaveLength(0);
  });

  it('devrait avoir tous les champs requis définis', () => {
    const user = new UserEntity();
    
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('firstName');
    expect(user).toHaveProperty('lastName');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('isActive');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });

  describe('Validation du champ email', () => {
    it('devrait rejeter un email invalide', async () => {
      const user = new UserEntity();
      user.email = 'invalid-email';
      
      const errors = await validate(user);
      const emailErrors = errors.find(err => err.property === 'email');
      
      expect(emailErrors).toBeDefined();
      expect(emailErrors?.constraints).toHaveProperty('isEmail');
    });

    it('devrait rejeter un email vide', async () => {
      const user = new UserEntity();
      user.email = '';
      
      const errors = await validate(user);
      const emailErrors = errors.find(err => err.property === 'email');
      
      expect(emailErrors).toBeDefined();
      expect(emailErrors?.constraints).toHaveProperty('isNotEmpty');
    });
  });

  describe('Validation du mot de passe', () => {
    it('devrait rejeter un mot de passe trop court', async () => {
      const user = new UserEntity();
      user.password = 'short';
      
      const errors = await validate(user);
      const passwordErrors = errors.find(err => err.property === 'password');
      
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors?.constraints).toHaveProperty('minLength');
    });

    it('devrait rejeter un mot de passe sans majuscule', async () => {
      const user = new UserEntity();
      user.password = 'password123!';
      
      const errors = await validate(user);
      const passwordErrors = errors.find(err => err.property === 'password');
      
      expect(passwordErrors).toBeDefined();
      expect(passwordErrors?.constraints).toHaveProperty('matches');
    });
  });

  describe('Validation du rôle', () => {
    it('devrait accepter uniquement les rôles valides', async () => {
      const user = new UserEntity();
      user.role = 'INVALID_ROLE' as UserRole;
      
      const errors = await validate(user);
      const roleErrors = errors.find(err => err.property === 'role');
      
      expect(roleErrors).toBeDefined();
      expect(roleErrors?.constraints).toHaveProperty('isEnum');
    });
  });

  describe('Validation des Rôles', () => {
    describe('isValidRoleTransition', () => {
      it('devrait empêcher un utilisateur banni de changer de rôle', () => {
        const user = new UserEntity();
        user.role = UserRole.BANNED;

        expect(user.isValidRoleTransition(UserRole.STUDENT)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.INSTRUCTOR)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.ADMIN)).toBe(false);
      });

      it('devrait empêcher un SUPER_ADMIN d\'être rétrogradé', () => {
        const user = new UserEntity();
        user.role = UserRole.ADMIN;
        user.isSuperAdmin = true;

        expect(user.isValidRoleTransition(UserRole.STUDENT)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.INSTRUCTOR)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.BANNED)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.ADMIN)).toBe(true);
      });

      it('devrait empêcher un ADMIN de devenir STUDENT ou INSTRUCTOR', () => {
        const user = new UserEntity();
        user.role = UserRole.ADMIN;
        user.isSuperAdmin = false;

        expect(user.isValidRoleTransition(UserRole.STUDENT)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.INSTRUCTOR)).toBe(false);
        expect(user.isValidRoleTransition(UserRole.BANNED)).toBe(true);
        expect(user.isValidRoleTransition(UserRole.ADMIN)).toBe(true);
      });

      it('devrait permettre les transitions valides', () => {
        const user = new UserEntity();
        user.role = UserRole.STUDENT;

        expect(user.isValidRoleTransition(UserRole.INSTRUCTOR)).toBe(true);
        expect(user.isValidRoleTransition(UserRole.ADMIN)).toBe(true);
        expect(user.isValidRoleTransition(UserRole.BANNED)).toBe(true);
      });
    });

    describe('canAccessResource', () => {
      it('devrait autoriser l\'accès aux routes publiques pour tous les rôles', () => {
        const user = new UserEntity();
        const roles = [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.BANNED];

        roles.forEach(role => {
          user.role = role;
          expect(user.canAccessResource('PUBLIC')).toBe(true);
        });
      });

      it('devrait refuser l\'accès aux utilisateurs bannis sauf pour les routes publiques', () => {
        const user = new UserEntity();
        user.role = UserRole.BANNED;

        expect(user.canAccessResource([UserRole.STUDENT])).toBe(false);
        expect(user.canAccessResource([UserRole.INSTRUCTOR])).toBe(false);
        expect(user.canAccessResource([UserRole.ADMIN])).toBe(false);
        expect(user.canAccessResource('SUPER_ADMIN_ONLY')).toBe(false);
        expect(user.canAccessResource('PUBLIC')).toBe(true);
      });

      it('devrait gérer correctement les accès SUPER_ADMIN', () => {
        const user = new UserEntity();
        user.role = UserRole.ADMIN;
        user.isSuperAdmin = true;

        expect(user.canAccessResource('SUPER_ADMIN_ONLY')).toBe(true);
        expect(user.canAccessResource([UserRole.ADMIN])).toBe(true);
        expect(user.canAccessResource([UserRole.INSTRUCTOR])).toBe(true);
      });

      it('devrait refuser l\'accès SUPER_ADMIN aux admins normaux', () => {
        const user = new UserEntity();
        user.role = UserRole.ADMIN;
        user.isSuperAdmin = false;

        expect(user.canAccessResource('SUPER_ADMIN_ONLY')).toBe(false);
        expect(user.canAccessResource([UserRole.ADMIN])).toBe(true);
        expect(user.canAccessResource([UserRole.INSTRUCTOR])).toBe(true);
      });

      it('devrait vérifier correctement les rôles requis pour les utilisateurs normaux', () => {
        const user = new UserEntity();
        user.role = UserRole.INSTRUCTOR;

        expect(user.canAccessResource([UserRole.INSTRUCTOR])).toBe(true);
        expect(user.canAccessResource([UserRole.STUDENT])).toBe(false);
        expect(user.canAccessResource([UserRole.ADMIN])).toBe(false);
        expect(user.canAccessResource([UserRole.INSTRUCTOR, UserRole.ADMIN])).toBe(true);
      });
    });

    describe('Validation du champ isSuperAdmin', () => {
      it('devrait valider isSuperAdmin uniquement pour les admins', async () => {
        const user = new UserEntity();
        user.email = 'test@example.com';
        user.password = 'Password123!';
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.role = UserRole.ADMIN;
        user.isActive = true;
        user.isSuperAdmin = true;

        const errors = await validate(user);
        const superAdminErrors = errors.find(err => err.property === 'isSuperAdmin');
        expect(superAdminErrors).toBeUndefined();
      });

      it('devrait rejeter isSuperAdmin pour les non-admins', async () => {
        const user = new UserEntity();
        user.email = 'test@example.com';
        user.password = 'Password123!';
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.role = UserRole.STUDENT;
        user.isActive = true;
        user.isSuperAdmin = true;

        const errors = await validate(user);
        const superAdminErrors = errors.find(err => err.property === 'isSuperAdmin');
        expect(superAdminErrors).toBeDefined();
        expect(superAdminErrors?.constraints).toHaveProperty('isSuperAdminConstraint');
        expect(superAdminErrors?.constraints?.isSuperAdminConstraint).toBe('Seuls les administrateurs peuvent être super administrateurs');
      });

      it('devrait accepter isSuperAdmin false pour les non-admins', async () => {
        const user = new UserEntity();
        user.email = 'test@example.com';
        user.password = 'Password123!';
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.role = UserRole.STUDENT;
        user.isActive = true;
        user.isSuperAdmin = false;

        const errors = await validate(user);
        const superAdminErrors = errors.find(err => err.property === 'isSuperAdmin');
        expect(superAdminErrors).toBeUndefined();
      });
    });
  });
}); 