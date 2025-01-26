import { describe, it, expect, beforeEach } from 'vitest';
import { RoleValidationService } from './role-validation.service';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

describe('RoleValidationService', () => {
  let service: RoleValidationService;
  let user: UserEntity;

  beforeEach(() => {
    service = new RoleValidationService();
    user = new UserEntity();
    user.email = 'test@example.com';
    user.password = 'Password123!';
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.isActive = true;
  });

  describe('validateRoleTransition', () => {
    it('devrait autoriser la transition de STUDENT vers INSTRUCTOR', () => {
      user.role = UserRole.STUDENT;
      expect(service.validateRoleTransition(user, UserRole.INSTRUCTOR)).toBe(true);
    });

    it('devrait interdire la transition de BANNED vers tout autre rôle', () => {
      user.role = UserRole.BANNED;
      expect(service.validateRoleTransition(user, UserRole.STUDENT)).toBe(false);
      expect(service.validateRoleTransition(user, UserRole.INSTRUCTOR)).toBe(false);
      expect(service.validateRoleTransition(user, UserRole.ADMIN)).toBe(false);
    });

    it('devrait interdire la transition de ADMIN vers STUDENT ou INSTRUCTOR', () => {
      user.role = UserRole.ADMIN;
      expect(service.validateRoleTransition(user, UserRole.STUDENT)).toBe(false);
      expect(service.validateRoleTransition(user, UserRole.INSTRUCTOR)).toBe(false);
    });

    it('devrait autoriser la transition de ADMIN vers BANNED', () => {
      user.role = UserRole.ADMIN;
      expect(service.validateRoleTransition(user, UserRole.BANNED)).toBe(true);
    });
  });

  describe('validateSuperAdminStatus', () => {
    it('devrait autoriser isSuperAdmin uniquement pour les ADMIN', () => {
      user.role = UserRole.ADMIN;
      expect(service.validateSuperAdminStatus(user, true)).toBe(true);
    });

    it('devrait interdire isSuperAdmin pour les non-ADMIN', () => {
      user.role = UserRole.STUDENT;
      expect(service.validateSuperAdminStatus(user, true)).toBe(false);
      
      user.role = UserRole.INSTRUCTOR;
      expect(service.validateSuperAdminStatus(user, true)).toBe(false);
      
      user.role = UserRole.BANNED;
      expect(service.validateSuperAdminStatus(user, true)).toBe(false);
    });

    it('devrait autoriser isSuperAdmin false pour tous les rôles', () => {
      const roles = [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.BANNED];
      roles.forEach(role => {
        user.role = role;
        expect(service.validateSuperAdminStatus(user, false)).toBe(true);
      });
    });
  });

  describe('validateRequiredRoles', () => {
    it('devrait autoriser l\'accès aux routes publiques pour tous les rôles', () => {
      const roles = [UserRole.STUDENT, UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.BANNED];
      roles.forEach(role => {
        user.role = role;
        expect(service.validateRequiredRoles(user, 'PUBLIC')).toBe(true);
      });
    });

    it('devrait interdire l\'accès aux utilisateurs bannis sauf pour les routes publiques', () => {
      user.role = UserRole.BANNED;
      expect(service.validateRequiredRoles(user, [UserRole.STUDENT])).toBe(false);
      expect(service.validateRequiredRoles(user, [UserRole.INSTRUCTOR])).toBe(false);
      expect(service.validateRequiredRoles(user, [UserRole.ADMIN])).toBe(false);
      expect(service.validateRequiredRoles(user, 'SUPER_ADMIN_ONLY')).toBe(false);
      expect(service.validateRequiredRoles(user, 'PUBLIC')).toBe(true);
    });

    it('devrait autoriser l\'accès aux ADMIN pour toutes les routes sauf SUPER_ADMIN_ONLY', () => {
      user.role = UserRole.ADMIN;
      user.isSuperAdmin = false;
      expect(service.validateRequiredRoles(user, [UserRole.STUDENT])).toBe(true);
      expect(service.validateRequiredRoles(user, [UserRole.INSTRUCTOR])).toBe(true);
      expect(service.validateRequiredRoles(user, [UserRole.ADMIN])).toBe(true);
      expect(service.validateRequiredRoles(user, 'SUPER_ADMIN_ONLY')).toBe(false);
    });

    it('devrait autoriser l\'accès aux SUPER_ADMIN pour toutes les routes', () => {
      user.role = UserRole.ADMIN;
      user.isSuperAdmin = true;
      expect(service.validateRequiredRoles(user, [UserRole.STUDENT])).toBe(true);
      expect(service.validateRequiredRoles(user, [UserRole.INSTRUCTOR])).toBe(true);
      expect(service.validateRequiredRoles(user, [UserRole.ADMIN])).toBe(true);
      expect(service.validateRequiredRoles(user, 'SUPER_ADMIN_ONLY')).toBe(true);
    });
  });
}); 