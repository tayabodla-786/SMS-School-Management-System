import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepository: Repository<Student>,
  ) {}

  async create(dto: CreateStudentDto) {
    const existing = await this.studentRepository.findOne({ where: { rollNo: dto.rollNo } });
    if (existing) throw new BadRequestException('Student with this Roll No already exists');

    const student = this.studentRepository.create(dto);
    return this.studentRepository.save(student);
  }

  async findAll() {
    return this.studentRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: CreateStudentDto) {
    const student = await this.findOne(id);
    Object.assign(student, dto);
    return this.studentRepository.save(student);
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await this.studentRepository.remove(student);
    return { message: 'Student deleted successfully' };
  }
}