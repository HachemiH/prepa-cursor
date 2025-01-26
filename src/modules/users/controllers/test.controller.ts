import { Controller, Get } from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@Controller('test')
export class TestController {
  @Get('public')
  @Roles('PUBLIC')
  getPublic() {
    return { message: 'Cette route est publique' };
  }

  @Get('admin')
  @Roles([UserRole.ADMIN])
  getAdmin() {
    return { message: 'Cette route est réservée aux admins' };
  }

  @Get('instructor')
  @Roles([UserRole.INSTRUCTOR])
  getInstructor() {
    return { message: 'Cette route est réservée aux instructeurs' };
  }

  @Get('student')
  @Roles([UserRole.STUDENT])
  getStudent() {
    return { message: 'Cette route est réservée aux étudiants' };
  }

  @Get('instructor-admin')
  @Roles([UserRole.INSTRUCTOR, UserRole.ADMIN])
  getInstructorOrAdmin() {
    return { message: 'Cette route est réservée aux instructeurs et admins' };
  }
} 