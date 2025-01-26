import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[] | 'PUBLIC' | 'SUPER_ADMIN_ONLY'>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est requis ou si la route est publique
    if (!requiredRoles || requiredRoles === 'PUBLIC') {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si l'utilisateur n'est pas connecté
    if (!user) {
      throw new UnauthorizedException('Vous devez être connecté pour accéder à cette ressource');
    }

    // Si l'utilisateur est banni
    if (user.role === UserRole.BANNED) {
      throw new ForbiddenException('Votre compte est banni, vous ne pouvez pas accéder à cette ressource');
    }

    // Si la route est réservée au SUPER_ADMIN
    if (requiredRoles === 'SUPER_ADMIN_ONLY') {
      if (!user.isSuperAdmin) {
        throw new ForbiddenException('Cette ressource est réservée au super administrateur');
      }
      return true;
    }

    // Les admins ont accès à tout (sauf SUPER_ADMIN_ONLY si non super admin)
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Vérification des rôles requis
    const hasRequiredRole = requiredRoles.includes(user.role);
    if (!hasRequiredRole) {
      throw new ForbiddenException(
        `Vous n'avez pas les permissions nécessaires. Votre rôle : ${user.role}. Rôle(s) requis : ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
} 