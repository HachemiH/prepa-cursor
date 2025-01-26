import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums/user-role.enum';

export const ROLES_KEY = 'roles';
export type RoleRequirement = UserRole[] | 'PUBLIC' | 'SUPER_ADMIN_ONLY';
export const Roles = (roles: RoleRequirement) => SetMetadata(ROLES_KEY, roles); 