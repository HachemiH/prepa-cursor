import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RolesController } from './controllers/roles.controller';
import { RoleValidationService } from './services/role-validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [RolesController],
  providers: [RoleValidationService],
  exports: [RoleValidationService],
})
export class UsersModule {}
