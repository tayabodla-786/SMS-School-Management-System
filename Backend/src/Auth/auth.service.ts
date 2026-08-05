import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private teacherRepository: Repository<Teacher>,
    private jwtService: JwtService,
    private activityLogService: ActivityLogService,
    private configService: ConfigService,
  ) {}

  private createMailTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || '587');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const secure = this.configService.get<string>('SMTP_SECURE') === 'true';

    if (!host || !user || !pass) {
      this.logger.warn('SMTP configuration is incomplete. Emails will not be sent.');
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }

  private async sendCredentialsEmail(email: string, password: string, role: string) {
    const transporter = this.createMailTransporter();
    if (!transporter) return;

    const from = this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const subject = 'Your SMS account credentials';

    const html = `
      <p>Hello,</p>
      <p>Your account has been created for the School Management System with the following details:</p>
      <ul>
        <li><strong>Role:</strong> ${role}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p>You can log in at <a href="${frontendUrl}/login">${frontendUrl}/login</a>.</p>
      <p>If you did not expect this email, please contact your administrator.</p>
    `;

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject,
        html,
      });
      this.logger.log(`Sent account credentials to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error as Error);
    }
  }

  async register(dto: any) {
    const { fullName, email, password, role, phone, subject, qualification, rollNumber, className, section } = dto;

    if (!fullName) {
      throw new BadRequestException('Full name is required');
    }

    if (!email) {
      throw new BadRequestException('Email is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    if (!role || !['admin', 'teacher', 'student'].includes(role)) {
      throw new BadRequestException('Valid role (admin, teacher, student) is required');
    }

    const existing = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });
    if (existing) throw new BadRequestException('Email already exists');

    if (role === 'student') {
      if (!rollNumber) {
        throw new BadRequestException('rollNumber is required for student registration');
      }
      if (!className && !section) {
        throw new BadRequestException('Class or section is required for student registration');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      phone,
      subject,
      qualification,
      rollNumber,
      className,
      section,
    });

    await this.userRepository.save(newUser);

    if (role === 'student') {
      try {
        await this.studentRepository.save(
          this.studentRepository.create({
            rollNo: rollNumber,
            email: email.toLowerCase(),
            name: fullName,
            class: className || section,
            phone: phone || null,
          }),
        );
      } catch (error) {
        await this.userRepository.delete({ id: newUser.id });
        throw error;
      }
    }

    if (role === 'teacher') {
      try {
        await this.teacherRepository.save(
          this.teacherRepository.create({
            name: fullName,
            email: email.toLowerCase(),
            phone: phone || null,
            subject: subject || null,
            qualification: qualification || null,
          }),
        );
      } catch (error) {
        await this.userRepository.delete({ id: newUser.id });
        throw error;
      }
    }

    // Send credentials email for students and teachers
    if (role === 'student' || role === 'teacher') {
      await this.sendCredentialsEmail(email.toLowerCase(), password, role);
    }

    // Log Activity - Register
    await this.activityLogService.logActivity(
      newUser.id,
      'registered',
      role,
      `${fullName} registered as ${role}`
    );

    return this.login(newUser);
  }

  async login(user: User) {
    const token = this.jwtService.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Log Activity - Login
    await this.activityLogService.logActivity(
      user.id,
      'logged_in',
      user.role,
      `${user.fullName} logged in as ${user.role}`
    );

    // Ensure related student/teacher record exists so panels show the user
    try {
      if (user.role === 'student') {
        const existingStudent = await this.studentRepository.findOne({ where: { email: user.email } });
        if (!existingStudent) {
          await this.studentRepository.save(
            this.studentRepository.create({
              rollNo: user.rollNumber || null,
              email: user.email,
              name: user.fullName,
              class: user.className || user.section || null,
              phone: user.phone || null,
            } as any),
          );
        }
      }

      if (user.role === 'teacher') {
        const existingTeacher = await this.teacherRepository.findOne({ where: { email: user.email } });
        if (!existingTeacher) {
          await this.teacherRepository.save(
            this.teacherRepository.create({
              name: user.fullName,
              email: user.email,
              phone: user.phone || null,
              subject: user.subject || null,
              qualification: user.qualification || null,
            } as any),
          );
        }
      }
    } catch (err) {
      // don't block login if linked record creation fails
      console.error('Failed to ensure linked record:', err);
    }

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      }
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return user;
  }
}