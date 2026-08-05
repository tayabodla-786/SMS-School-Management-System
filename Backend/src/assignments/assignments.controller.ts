import { Controller, Get, Post, Put, Param, Query, Body, NotFoundException } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { SubmitAssignmentDto } from './dto/submit-assignment.dto';

@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @Post()
  create(@Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.create(dto);
  }

  @Get()
  findAll(@Query('teacherId') teacherId?: string, @Query('studentId') studentId?: string) {
    return this.assignmentsService.findAll(teacherId, studentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const assignment = await this.assignmentsService.findOne(id);
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    return assignment;
  }

  @Put(':id/submit')
  submit(@Param('id') id: string, @Body() dto: SubmitAssignmentDto) {
    return this.assignmentsService.submit(id, dto);
  }
}
