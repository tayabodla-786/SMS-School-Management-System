import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from './classes.controller';
import { ClassesService } from './classes.service';
import { Class } from './entities/class.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { User } from 'src/Auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Class, User]),
    ActivityLogModule,
  ],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}