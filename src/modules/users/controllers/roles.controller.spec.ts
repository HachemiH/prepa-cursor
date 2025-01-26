import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RolesController } from './roles.controller';
import { RoleValidationService } from '../services/role-validation.service';
import { UserRole } from '../enums/user-role.enum';
import { ForbiddenException } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

describe('RolesController', () => {
  let controller: RolesController;
  let roleValidationService: RoleValidationService;
  let userRepository: Repository<UserEntity>;

  const mockUser = new UserEntity();
  mockUser.id = '1';
  mockUser.email = 'test@example.com';
  mockUser.role = UserRole.ADMIN;
  mockUser.isSuperAdmin = true;

  beforeEach(() => {
    userRepository = {
      findOne: vi.fn(),
      save: vi.fn(),
    } as unknown as Repository<UserEntity>;

    roleValidationService = {
      validateRoleTransition: vi.fn(),
      validateRequiredRoles: vi.fn(),
      validateSuperAdminStatus: vi.fn(),
    } as unknown as RoleValidationService;

    controller = new RolesController(roleValidationService, userRepository);
  });

  it('devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  describe('getRoles', () => {
    it('devrait retourner la liste des rôles disponibles', () => {
      const roles = controller.getRoles();
      expect(roles).toEqual(Object.values(UserRole));
    });

    it('devrait retourner un tableau non vide', () => {
      const roles = controller.getRoles();
      expect(roles.length).toBeGreaterThan(0);
    });

    it('devrait inclure tous les rôles définis', () => {
      const roles = controller.getRoles();
      expect(roles).toContain(UserRole.STUDENT);
      expect(roles).toContain(UserRole.INSTRUCTOR);
      expect(roles).toContain(UserRole.ADMIN);
      expect(roles).toContain(UserRole.BANNED);
    });
  });

  describe('updateUserRole', () => {
    const targetUserId = '2';
    const newRole = UserRole.INSTRUCTOR;

    it('devrait mettre à jour le rôle si la transition est valide', async () => {
      vi.spyOn(roleValidationService, 'validateRoleTransition').mockReturnValue(
        true,
      );
      vi.spyOn(roleValidationService, 'validateRequiredRoles').mockReturnValue(
        true,
      );
      vi.spyOn(userRepository, 'findOne').mockResolvedValue(new UserEntity());
      vi.spyOn(userRepository, 'save').mockResolvedValue(new UserEntity());

      const result = await controller.updateUserRole(mockUser, targetUserId, {
        role: newRole,
      });

      expect(result).toEqual({
        message: 'Rôle mis à jour avec succès',
        role: newRole,
      });
    });

    it("devrait rejeter si l'utilisateur n'est pas autorisé", async () => {
      vi.spyOn(roleValidationService, 'validateRequiredRoles').mockReturnValue(
        false,
      );

      await expect(
        controller.updateUserRole(mockUser, targetUserId, { role: newRole }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('devrait rejeter si la transition de rôle est invalide', async () => {
      vi.spyOn(roleValidationService, 'validateRequiredRoles').mockReturnValue(
        true,
      );
      vi.spyOn(roleValidationService, 'validateRoleTransition').mockReturnValue(
        false,
      );
      vi.spyOn(userRepository, 'findOne').mockResolvedValue(new UserEntity());

      await expect(
        controller.updateUserRole(mockUser, targetUserId, { role: newRole }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("devrait rejeter si l'utilisateur essaie de modifier son propre rôle", async () => {
      await expect(
        controller.updateUserRole(mockUser, mockUser.id, { role: newRole }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
