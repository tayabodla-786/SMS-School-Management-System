import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { ActivityLog } from '../activity-log/entities/activity-log.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    @InjectRepository(ActivityLog) private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async findAll(role?: string) {
    if (role) {
      return this.userRepository.find({ where: { role }, order: { createdAt: 'DESC' } });
    }
    return this.userRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: any) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const originalEmail = user.email;
    const newEmail = dto.email ? dto.email.toLowerCase() : user.email;

    if (dto.email && dto.email.toLowerCase() !== originalEmail) {
      const existing = await this.userRepository.findOne({ where: { email: dto.email.toLowerCase() } });
      if (existing) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (dto.role && dto.role !== user.role) {
      throw new BadRequestException('Role changes are not supported through this endpoint');
    }

    user.fullName = dto.fullName ?? user.fullName;
    user.email = newEmail;
    user.phone = dto.phone ?? user.phone;
    user.subject = dto.subject ?? user.subject;
    user.qualification = dto.qualification ?? user.qualification;
    user.rollNumber = dto.rollNumber ?? user.rollNumber;
    user.className = dto.className ?? user.className;
    user.section = dto.section ?? user.section;

    if (dto.password) {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user.password = hashedPassword;
    }

    await this.userRepository.save(user);

    if (user.role === 'student') {
      const student =
        (await this.studentRepository.findOne({ where: { email: originalEmail } })) ||
        (await this.studentRepository.findOne({ where: { email: newEmail } }));

      if (student) {
        student.email = newEmail;
        student.name = user.fullName;
        student.rollNo = user.rollNumber || student.rollNo;
        student.class = user.className || user.section || student.class;
        student.phone = user.phone || student.phone;
        await this.studentRepository.save(student);
      }
    }

    if (user.role === 'teacher') {
      const teacher =
        (await this.teacherRepository.findOne({ where: { email: originalEmail } })) ||
        (await this.teacherRepository.findOne({ where: { email: newEmail } }));

      if (teacher) {
        teacher.email = newEmail;
        teacher.name = user.fullName;
        teacher.subject = user.subject || teacher.subject;
        teacher.qualification = user.qualification || teacher.qualification;
        teacher.phone = user.phone || teacher.phone;
        await this.teacherRepository.save(teacher);
      }
    }

    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // delete related activity logs first to avoid FK constraint errors
    await this.activityLogRepository
      .createQueryBuilder()
      .delete()
      .from(ActivityLog)
      .where('userId = :userId', { userId: user.id })
      .execute();

    // delete related student/teacher records by email
    if (user.role === 'student') {
      await this.studentRepository.delete({ email: user.email });
    }

    if (user.role === 'teacher') {
      await this.teacherRepository.delete({ email: user.email });
    }

    await this.userRepository.delete({ id });
    return { message: 'User and related records deleted' };
  }
}
