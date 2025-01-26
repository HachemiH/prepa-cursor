import { Controller, Get, Patch, Param, Body, UnauthorizedException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RoleValidationService } from '../services/role-validation.service';
import { UserEntity } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly roleValidationService: RoleValidationService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Get()
  @Roles('PUBLIC')
  getRoles(): UserRole[] {
    return Object.values(UserRole);
  }

  @Patch('users/:id')
  @Roles([UserRole.ADMIN])
  async updateUserRole(
    @CurrentUser() currentUser: UserEntity | undefined,
    @Param('id') targetUserId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    // Vérifier si l'utilisateur est authentifié
    if (!currentUser) {
      throw new UnauthorizedException('Vous devez être authentifié');
    }

    // Un utilisateur ne peut pas modifier son propre rôle
    if (currentUser.id === targetUserId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier votre propre rôle');
    }

    // Vérifier si l'utilisateur a les permissions nécessaires
    if (!this.roleValidationService.validateRequiredRoles(currentUser, [UserRole.ADMIN])) {
      throw new ForbiddenException('Vous n\'avez pas les permissions nécessaires');
    }

    // Récupérer l'utilisateur cible
    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si la transition de rôle est valide
    if (!this.roleValidationService.validateRoleTransition(targetUser, updateRoleDto.role)) {
      throw new ForbiddenException('Cette transition de rôle n\'est pas autorisée');
    }

    // Mettre à jour le rôle
    targetUser.role = updateRoleDto.role;
    await this.userRepository.save(targetUser);

    return {
      message: 'Rôle mis à jour avec succès',
      role: updateRoleDto.role,
    };
  }
} 