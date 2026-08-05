import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../Auth/entities/user.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  class_name!: string;

  @Column()
  section!: string;

  @Column({ nullable: true })
  roomNumber!: string;

  @Column({ default: 40 })
  capacity!: number;

  @Column({ nullable: true })
  teacherId!: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'teacherId' })
  teacher?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}