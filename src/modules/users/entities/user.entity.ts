import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength, Matches, IsEnum, IsBoolean, Validate, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

@ValidatorConstraint({ name: 'isSuperAdminConstraint', async: false })
class IsSuperAdminConstraint implements ValidatorConstraintInterface {
  validate(value: boolean, args: any) {
    const object = args.object as UserEntity;
    if (object.role !== UserRole.ADMIN && value === true) {
      return false;
    }
    return true;
  }

  defaultMessage() {
    return 'Seuls les administrateurs peuvent être super administrateurs';
  }
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
  })
  password: string;

  @Column()
  @IsNotEmpty()
  firstName: string;

  @Column()
  @IsNotEmpty()
  lastName: string;

  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  @Validate(IsSuperAdminConstraint, {
    message: 'Seuls les administrateurs peuvent être super administrateurs'
  })
  isSuperAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Méthodes de validation
  isValidRoleTransition(newRole: UserRole): boolean {
    // Un utilisateur banni ne peut pas changer de rôle
    if (this.role === UserRole.BANNED) {
      return false;
    }

    // Un SUPER_ADMIN ne peut pas être rétrogradé
    if (this.isSuperAdmin && newRole !== UserRole.ADMIN) {
      return false;
    }

    // Un ADMIN ne peut pas devenir STUDENT ou INSTRUCTOR
    if (this.role === UserRole.ADMIN && (newRole === UserRole.STUDENT || newRole === UserRole.INSTRUCTOR)) {
      return false;
    }

    return true;
  }

  canAccessResource(requiredRoles: UserRole[] | 'PUBLIC' | 'SUPER_ADMIN_ONLY'): boolean {
    // Les routes publiques sont accessibles à tous
    if (requiredRoles === 'PUBLIC') {
      return true;
    }

    // Les utilisateurs bannis n'ont accès à rien sauf les routes publiques
    if (this.role === UserRole.BANNED) {
      return false;
    }

    // Vérification SUPER_ADMIN
    if (requiredRoles === 'SUPER_ADMIN_ONLY') {
      return this.isSuperAdmin;
    }

    // Les admins ont accès à tout (sauf SUPER_ADMIN_ONLY si non super admin)
    if (this.role === UserRole.ADMIN) {
      return true;
    }

    // Vérification des rôles requis
    return Array.isArray(requiredRoles) && requiredRoles.includes(this.role);
  }
}