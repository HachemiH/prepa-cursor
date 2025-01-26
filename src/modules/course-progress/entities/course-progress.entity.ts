import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsBoolean, ValidateIf, IsDate } from 'class-validator';
import { StudentEntity } from '../../students/entities/student.entity';
import { ModuleEntity } from '../../modules/entities/module.entity';

@Entity('course_progress')
export class CourseProgressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StudentEntity)
  @JoinColumn()
  @IsNotEmpty()
  student: StudentEntity;

  @ManyToOne(() => ModuleEntity)
  @JoinColumn()
  @IsNotEmpty()
  module: ModuleEntity;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  @ValidateIf(o => o.completed === true)
  @IsDate()
  completedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
