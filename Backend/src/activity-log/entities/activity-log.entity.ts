import { User } from '../../Auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User | null;

  @Column()
  action!: string;

  @Column()
  entity!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  timestamp!: Date;
}