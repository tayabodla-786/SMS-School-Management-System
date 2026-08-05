import { Controller, Get } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';

@Controller('activity-log')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @Get()
  getRecentActivities() {
    return this.activityLogService.getRecentActivities();
  }
}