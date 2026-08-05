import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
  ) {}

  async create(dto: CreateTeacherDto) {
    const teacher = this.teacherRepository.create(dto);
    return this.teacherRepository.save(teacher);
  }

  async findAll() {
    return this.teacherRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async remove(id: string) {
    const teacher = await this.findOne(id);
    await this.teacherRepository.remove(teacher);
    return { message: 'Teacher deleted successfully' };
  }
}