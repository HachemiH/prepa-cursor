import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RoleValidationService {
  validateRoleTransition(user: UserEntity, newRole: UserRole): boolean {
    // Un utilisateur banni ne peut pas changer de rôle
    if (user.role === UserRole.BANNED) {
      return false;
    }

    // Un ADMIN ne peut pas devenir STUDENT ou INSTRUCTOR
    if (user.role === UserRole.ADMIN && (newRole === UserRole.STUDENT || newRole === UserRole.INSTRUCTOR)) {
      return false;
    }

    // Un SUPER_ADMIN ne peut pas être rétrogradé
    if (user.isSuperAdmin && newRole !== UserRole.ADMIN) {
      return false;
    }

    return true;
  }

  validateSuperAdminStatus(user: UserEntity, isSuperAdmin: boolean): boolean {
    // Si on essaie de mettre isSuperAdmin à true
    if (isSuperAdmin) {
      // Seuls les ADMIN peuvent être SUPER_ADMIN
      return user.role === UserRole.ADMIN;
    }
    
    // N'importe quel rôle peut avoir isSuperAdmin à false
    return true;
  }

  validateRequiredRoles(user: UserEntity, requiredRoles: UserRole[] | 'PUBLIC' | 'SUPER_ADMIN_ONLY'): boolean {
    // Les routes publiques sont accessibles à tous
    if (requiredRoles === 'PUBLIC') {
      return true;
    }

    // Les utilisateurs bannis n'ont accès à rien sauf les routes publiques
    if (user.role === UserRole.BANNED) {
      return false;
    }

    // Vérification SUPER_ADMIN
    if (requiredRoles === 'SUPER_ADMIN_ONLY') {
      return user.isSuperAdmin;
    }

    // Les admins ont accès à tout (sauf SUPER_ADMIN_ONLY si non super admin)
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Vérification des rôles requis
    return Array.isArray(requiredRoles) && requiredRoles.includes(user.role);
  }
} 