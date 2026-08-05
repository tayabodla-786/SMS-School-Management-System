import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { User } from '../Auth/entities/user.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private classRepository: Repository<Class>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private activityLogService: ActivityLogService,
  ) {}

  async create(dto: CreateClassDto) {
    const newClass = this.classRepository.create({
      class_name: dto.class_name,
      section: dto.section,
      roomNumber: dto.roomNumber,
      capacity: dto.capacity || 40,
      teacherId: dto.teacherId || undefined,    
    });

    const savedClass = await this.classRepository.save(newClass);

    await this.activityLogService.logActivity(
      'system',
      'created',
      'class',
      `Class ${dto.class_name} created`
    );

    return savedClass;
  }

  async getTeachers() {
  return this.userRepository.find({
    where: { role: 'teacher' },
    select: ['id', 'fullName', 'subject']
  });
}

  async findAll(teacherId?: string) {
    return this.classRepository.find({
      where: teacherId ? { teacherId } : {},
      relations: ['teacher'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const cls = await this.classRepository.findOne({ where: { id } });
    if (!cls) throw new NotFoundException('Class not found');
    return cls;
  }

  async update(id: string, dto: CreateClassDto) {
    const cls = await this.findOne(id);
    Object.assign(cls, dto);
    return this.classRepository.save(cls);
  }

  async remove(id: string) {
    const cls = await this.findOne(id);
    await this.classRepository.remove(cls);
    return { message: 'Class deleted successfully' };
  }
}