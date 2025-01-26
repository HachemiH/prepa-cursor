import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  MinLength,
  ArrayNotEmpty,
  Min,
  Max,
  IsNumber,
} from 'class-validator';
import { UserEntity } from '../../users/entities/user.entity';
import { CourseEntity } from '../../courses/entities/course.entity';
// import { CourseEntity } from '../../courses/entities/course.entity';

@Entity('instructors')
export class InstructorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  @IsNotEmpty()
  user: UserEntity;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @MinLength(100)
  bio: string;

  @Column('simple-array')
  @IsNotEmpty()
  @ArrayNotEmpty()
  expertise: string[];

  @Column({ type: 'float', default: 0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @OneToMany(() => CourseEntity, course => course.instructor)
  courses: CourseEntity[];

  // @OneToMany(() => CourseEntity, (course) => course.instructor)
  // courses: CourseEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 
