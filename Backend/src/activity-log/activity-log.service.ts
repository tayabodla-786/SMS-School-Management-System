import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog) private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(userId: string, action: string, entity: string, description: string) {
    try {
      const isUuid = (s: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);
      const userRef = userId && isUuid(userId) ? { id: userId } : null;
      const log = this.activityLogRepository.create({
        user: userRef,
        action,
        entity,
        description,
      });
      await this.activityLogRepository.save(log);
    } catch (err) {
      console.error("Activity Log Error:", err);
    }
  }

  async getRecentActivities() {
    return this.activityLogRepository.find({
      relations: ['user'],
      order: { timestamp: 'DESC' },
      take: 10,
    });
  }
}