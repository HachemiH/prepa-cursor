import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, MinLength, ArrayNotEmpty, IsEnum } from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { StudentLevel } from '../enums/student-level.enum';
import { CourseEntity } from '../../courses/entities/course.entity';
import { CourseProgressEntity } from '../../course-progress/entities/course-progress.entity';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  @IsNotEmpty()
  user: UserEntity;

  @Column({ type: 'enum', enum: StudentLevel })
  @IsNotEmpty()
  @IsEnum(StudentLevel)
  level: StudentLevel;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @MinLength(20)
  bio: string;

  @Column('simple-array')
  @IsNotEmpty()
  @ArrayNotEmpty()
  interests: string[];

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => CourseEntity, course => course.students)
  enrolledCourses: CourseEntity[];

  @OneToMany(() => CourseProgressEntity, progress => progress.student)
  progress: CourseProgressEntity[];
} 