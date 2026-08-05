import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get('teachers')
  getTeachers() {
    return this.classesService.getTeachers();
  }

  @Get()
  findAll(@Query('teacherId') teacherId?: string) {
    return this.classesService.findAll(teacherId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateClassDto: CreateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(id);
  }
}