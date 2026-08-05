import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  fullName!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  subject!: string;

  @Column({ nullable: true })
  qualification!: string;

  @Column({ nullable: true })
  rollNumber!: string;

  @Column({ nullable: true })
  className!: string;

  @Column({ nullable: true })
  section!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}