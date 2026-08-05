import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectRepository(Assignment)
    private readonly assignmentRepository: Repository<Assignment>,
  ) {}

  async create(dto: CreateAssignmentDto) {
    const assignment = this.assignmentRepository.create({
      ...dto,
      status: 'assigned',
      assignedAt: new Date(),
      submittedAt: null,
    });

    return this.assignmentRepository.save(assignment);
  }

  async findAll(teacherId?: string, studentId?: string) {
    const query = this.assignmentRepository.createQueryBuilder('assignment');

    if (teacherId) {
      query.andWhere('assignment.teacherId = :teacherId', { teacherId });
    }

    if (studentId) {
      query.andWhere('assignment.studentId = :studentId', { studentId });
    }

    return query.orderBy('assignment.assignedAt', 'DESC').getMany();
  }

  async findOne(id: string) {
    return this.assignmentRepository.findOne({ where: { id } });
  }

  async submit(id: string, dto: SubmitAssignmentDto) {
    const assignment = await this.findOne(id);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    if (assignment.status === 'submitted') {
      throw new BadRequestException('Assignment already submitted');
    }

    assignment.answers = dto.answers;
    assignment.status = 'submitted';
    assignment.submittedAt = new Date();

    return this.assignmentRepository.save(assignment);
  }
}
