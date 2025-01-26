import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../enums/user-role.enum';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockContext: ExecutionContext;

  beforeEach(() => {
    reflector = {
      get: vi.fn(),
      getAllAndOverride: vi.fn()
    } as unknown as Reflector;

    mockContext = {
      getHandler: vi.fn(),
      getClass: vi.fn(),
      switchToHttp: vi.fn().mockReturnValue({
        getRequest: vi.fn().mockReturnValue({
          user: null
        })
      })
    } as unknown as ExecutionContext;

    guard = new RolesGuard(reflector);
  });

  describe('Routes Publiques', () => {
    it('devrait autoriser l\'accès aux routes marquées comme publiques', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue('PUBLIC');
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({ user: null });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès aux routes publiques même pour les utilisateurs bannis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue('PUBLIC');
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.BANNED }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès aux routes publiques pour les utilisateurs connectés', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue('PUBLIC');
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.STUDENT }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });
  });

  describe('Routes Protégées', () => {
    it('devrait lever UnauthorizedException si l\'utilisateur n\'est pas connecté', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.STUDENT]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({ user: null });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait lever ForbiddenException si l\'utilisateur est banni', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.STUDENT]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.BANNED }
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait lever ForbiddenException si l\'utilisateur n\'a pas le rôle requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.STUDENT }
      });

      await expect(guard.canActivate(mockContext)).rejects.toThrow(ForbiddenException);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès si l\'utilisateur a le rôle exact requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.INSTRUCTOR]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.INSTRUCTOR }
      });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès si l\'utilisateur a un des rôles requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.INSTRUCTOR, UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN }
      });

      const result = await guard.canActivate(mockContext);
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });
  });

  describe('Gestion des Erreurs de Permissions', () => {
    it('devrait inclure le rôle requis dans le message d\'erreur ForbiddenException', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.STUDENT }
      });

      let error: Error | null = null;
      try {
        await guard.canActivate(mockContext);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error?.message).toContain(UserRole.ADMIN);
    });

    it('devrait inclure le rôle de l\'utilisateur dans le message d\'erreur ForbiddenException', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.STUDENT }
      });

      let error: Error | null = null;
      try {
        await guard.canActivate(mockContext);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error?.message).toContain(UserRole.STUDENT);
    });

    it('devrait avoir un message clair pour les utilisateurs bannis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.STUDENT]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.BANNED }
      });

      let error: Error | null = null;
      try {
        await guard.canActivate(mockContext);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error?.message).toContain('banni');
    });

    it('devrait avoir un message clair pour les utilisateurs non connectés', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.STUDENT]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({ user: null });

      let error: Error | null = null;
      try {
        await guard.canActivate(mockContext);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error?.message).toContain('connecté');
    });
  });

  describe('canActivate', () => {
    it('devrait autoriser l\'accès si aucun rôle n\'est requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue(undefined);

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès si l\'utilisateur a le rôle requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès si l\'utilisateur a un des rôles requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.INSTRUCTOR, UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.INSTRUCTOR }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès aux admins même si un autre rôle est requis', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.INSTRUCTOR]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });
  });

  describe('Gestion SUPER_ADMIN', () => {
    it('devrait autoriser l\'accès au SUPER_ADMIN pour toutes les routes protégées', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.INSTRUCTOR]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN, isSuperAdmin: true }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait autoriser l\'accès au SUPER_ADMIN même pour les routes admin', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue([UserRole.ADMIN]);
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN, isSuperAdmin: true }
      });

      const result = await guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalled();
    });

    it('devrait refuser l\'accès à un admin non SUPER_ADMIN pour les routes SUPER_ADMIN', async () => {
      reflector.getAllAndOverride = vi.fn().mockReturnValue('SUPER_ADMIN_ONLY');
      mockContext.switchToHttp().getRequest = vi.fn().mockReturnValue({
        user: { role: UserRole.ADMIN, isSuperAdmin: false }
      });

      let error: Error | null = null;
      try {
        await guard.canActivate(mockContext);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ForbiddenException);
      expect(error?.message).toContain('super administrateur');
    });
  });
}); 