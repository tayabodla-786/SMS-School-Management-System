import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { ActivityLog } from '../activity-log/entities/activity-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Teacher, ActivityLog]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    ActivityLogModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}