import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, MinLength, Min } from 'class-validator';
import { CourseEntity } from '../../courses/entities/course.entity';

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  @MinLength(5)
  title: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @ManyToOne(() => CourseEntity)
  @JoinColumn()
  @IsNotEmpty()
  course: CourseEntity;

  @Column({ type: 'integer' })
  @IsNotEmpty()
  @Min(0)
  order: number;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @MinLength(20)
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
