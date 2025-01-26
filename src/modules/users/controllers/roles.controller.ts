import { Controller, Get, Patch, Param, Body, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleValidationService } from '../services/role-validation.service';
import { UserEntity } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly roleValidationService: RoleValidationService) {}

  @Get()
  @Roles('PUBLIC')
  getRoles(): UserRole[] {
    return Object.values(UserRole);
  }

  @Patch('users/:id')
  @Roles([UserRole.ADMIN])
  async updateUserRole(
    @CurrentUser() currentUser: UserEntity,
    @Param('id') targetUserId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    // Un utilisateur ne peut pas modifier son propre rôle
    if (currentUser.id === targetUserId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier votre propre rôle');
    }

    // Vérifier si l'utilisateur a les permissions nécessaires
    if (!this.roleValidationService.validateRequiredRoles(currentUser, [UserRole.ADMIN])) {
      throw new UnauthorizedException('Vous n\'avez pas les permissions nécessaires');
    }

    // Vérifier si la transition de rôle est valide
    const targetUser = new UserEntity(); // TODO: Récupérer l'utilisateur cible depuis la base de données
    targetUser.role = updateRoleDto.role;
    
    if (!this.roleValidationService.validateRoleTransition(targetUser, updateRoleDto.role)) {
      throw new ForbiddenException('Cette transition de rôle n\'est pas autorisée');
    }

    // TODO: Mettre à jour le rôle dans la base de données

    return {
      message: 'Rôle mis à jour avec succès',
      role: updateRoleDto.role,
    };
  }
} 