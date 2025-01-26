import { IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
} 