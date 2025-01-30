import { describe, it, expect } from 'vitest';
import { UserEntity } from '../users/entities/user.entity';
import { StudentEntity } from '../students/entities/student.entity';
import { InstructorEntity } from '../instructors/entities/instructor.entity';
import { CourseEntity } from '../courses/entities/course.entity';
import { ModuleEntity } from '../modules/entities/module.entity';
import { CourseProgressEntity } from '../course-progress/entities/course-progress.entity';
import { UserRole } from '../users/enums/user-role.enum';

describe('Relations entre entités', () => {
  describe('Relations Student', () => {
    it("devrait pouvoir s'inscrire à plusieurs cours", () => {
      const student = new StudentEntity();
      const user = new UserEntity();
      user.email = 'student@example.com';
      user.password = 'Password1@';
      user.firstName = 'Jane';
      user.lastName = 'Doe';
      user.role = UserRole.STUDENT;
      user.isActive = true;
      student.user = user;
      student.lastLoginAt = new Date();

      const course1 = new CourseEntity();
      course1.title = 'Cours 1';
      course1.description = 'Description du cours 1';
      course1.isPublished = true;

      const course2 = new CourseEntity();
      course2.title = 'Cours 2';
      course2.description = 'Description du cours 2';
      course2.isPublished = true;

      student.enrolledCourses = [course1, course2];

      expect(student.enrolledCourses).toHaveLength(2);
      expect(student.enrolledCourses).toContain(course1);
      expect(student.enrolledCourses).toContain(course2);
    });

    it('devrait pouvoir suivre sa progression dans plusieurs modules', () => {
      const student = new StudentEntity();
      const user = new UserEntity();
      user.email = 'student@example.com';
      user.password = 'Password1@';
      user.firstName = 'Jane';
      user.lastName = 'Doe';
      user.role = UserRole.STUDENT;
      user.isActive = true;
      student.user = user;
      student.lastLoginAt = new Date();

      const module1 = new ModuleEntity();
      module1.title = 'Module 1';
      module1.description = 'Description du module 1';
      module1.content = 'Contenu du module 1';
      module1.order = 1;

      const module2 = new ModuleEntity();
      module2.title = 'Module 2';
      module2.description = 'Description du module 2';
      module2.content = 'Contenu du module 2';
      module2.order = 2;

      const progress1 = new CourseProgressEntity();
      progress1.student = student;
      progress1.module = module1;
      progress1.completed = true;
      progress1.completedAt = new Date();

      const progress2 = new CourseProgressEntity();
      progress2.student = student;
      progress2.module = module2;
      progress2.completed = false;

      student.progress = [progress1, progress2];

      expect(student.progress).toHaveLength(2);
      expect(student.progress).toContain(progress1);
      expect(student.progress).toContain(progress2);
    });
  });

  describe('Relations Instructor', () => {
    it('devrait pouvoir créer plusieurs cours', () => {
      const instructor = new InstructorEntity();
      const user = new UserEntity();
      user.email = 'instructor@example.com';
      user.password = 'Password1@';
      user.firstName = 'John';
      user.lastName = 'Doe';
      user.role = UserRole.INSTRUCTOR;
      user.isActive = true;
      instructor.user = user;
      instructor.bio = "Bio de l'instructeur";
      instructor.expertise = ['JavaScript', 'TypeScript'];
      instructor.rating = 4.5;

      const course1 = new CourseEntity();
      course1.title = 'Cours 1';
      course1.description = 'Description du cours 1';
      course1.instructor = instructor;
      course1.isPublished = true;

      const course2 = new CourseEntity();
      course2.title = 'Cours 2';
      course2.description = 'Description du cours 2';
      course2.instructor = instructor;
      course2.isPublished = false;

      instructor.courses = [course1, course2];

      expect(instructor.courses).toHaveLength(2);
      expect(instructor.courses).toContain(course1);
      expect(instructor.courses).toContain(course2);
      expect(course1.instructor).toBe(instructor);
      expect(course2.instructor).toBe(instructor);
    });
  });

  describe('Relations Course', () => {
    it('devrait pouvoir avoir plusieurs étudiants inscrits', () => {
      const course = new CourseEntity();
      course.title = 'Cours';
      course.description = 'Description du cours';
      course.isPublished = true;

      const student1 = new StudentEntity();
      const user1 = new UserEntity();
      user1.email = 'student1@example.com';
      user1.password = 'Password1@';
      user1.firstName = 'Jane';
      user1.lastName = 'Doe';
      user1.role = UserRole.STUDENT;
      user1.isActive = true;
      student1.user = user1;
      student1.lastLoginAt = new Date();

      const student2 = new StudentEntity();
      const user2 = new UserEntity();
      user2.email = 'student2@example.com';
      user2.password = 'Password1@';
      user2.firstName = 'John';
      user2.lastName = 'Smith';
      user2.role = UserRole.STUDENT;
      user2.isActive = true;
      student2.user = user2;
      student2.lastLoginAt = new Date();

      course.students = [student1, student2];

      expect(course.students).toHaveLength(2);
      expect(course.students).toContain(student1);
      expect(course.students).toContain(student2);
    });

    it('devrait pouvoir avoir plusieurs modules', () => {
      const course = new CourseEntity();
      course.title = 'Cours';
      course.description = 'Description du cours';
      course.isPublished = true;

      const module1 = new ModuleEntity();
      module1.title = 'Module 1';
      module1.description = 'Description du module 1';
      module1.content = 'Contenu du module 1';
      module1.order = 1;
      module1.course = course;

      const module2 = new ModuleEntity();
      module2.title = 'Module 2';
      module2.description = 'Description du module 2';
      module2.content = 'Contenu du module 2';
      module2.order = 2;
      module2.course = course;

      course.modules = [module1, module2];

      expect(course.modules).toHaveLength(2);
      expect(course.modules).toContain(module1);
      expect(course.modules).toContain(module2);
      expect(module1.course).toBe(course);
      expect(module2.course).toBe(course);
    });
  });
});
