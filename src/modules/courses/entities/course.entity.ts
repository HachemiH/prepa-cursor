import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import {
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { InstructorEntity } from '../../instructors/entities/instructor.entity';
import { StudentEntity } from '../../students/entities/student.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';

@Entity('courses')
export class CourseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ManyToOne(() => InstructorEntity)
  @JoinColumn()
  @IsNotEmpty()
  instructor: InstructorEntity;

  @ManyToMany(() => StudentEntity, student => student.enrolledCourses)
  @JoinTable()
  students: StudentEntity[];

  @OneToMany(() => ModuleEntity, module => module.course)
  modules: ModuleEntity[];

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 