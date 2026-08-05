import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  teacherId!: string;

  @Column()
  teacherName!: string;

  @Column()
  studentId!: string;

  @Column()
  studentName!: string;

  @Column({ type: 'json' })
  questions!: Array<{
    id: string;
    text: string;
    options: string[];
  }>;

  @Column({ type: 'json', nullable: true })
  answers!: Array<{
    questionId: string;
    selectedOption: string;
  }> | null;

  @Column({ default: 'assigned' })
  status!: 'assigned' | 'submitted';

  @Column({ type: 'timestamp with time zone' })
  assignedAt!: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  submittedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
