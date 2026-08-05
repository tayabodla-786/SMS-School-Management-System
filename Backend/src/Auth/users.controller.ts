import { Controller, Get, Query, Param, Body, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findAll(@Query('role') role?: string) {
    const users = await this.usersService.findAll(role);

    // Map user fields to shapes the frontend expects for students/teachers
    return users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      name: u.fullName,
      email: u.email,
      role: u.role,
      phone: u.phone || null,
      subject: u.subject || null,
      qualification: u.qualification || null,
      rollNo: u.rollNumber || null,
      class: u.className || null,
      section: u.section || null,
      teacherId: u.id,
      createdAt: u.createdAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const u = await this.usersService.findOne(id);
    if (!u) return null;
    return {
      id: u.id,
      fullName: u.fullName,
      name: u.fullName,
      email: u.email,
      role: u.role,
      phone: u.phone || null,
      subject: u.subject || null,
      qualification: u.qualification || null,
      rollNo: u.rollNumber || null,
      class: u.className || null,
      section: u.section || null,
      teacherId: u.id,
      createdAt: u.createdAt,
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.usersService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}