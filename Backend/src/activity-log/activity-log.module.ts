import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogController } from './activity-log.controller';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from '../Auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, User])],
  controllers: [ActivityLogController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],   
})
export class ActivityLogModule {}