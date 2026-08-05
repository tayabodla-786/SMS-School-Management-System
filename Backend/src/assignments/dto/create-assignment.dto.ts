import { IsString, IsNotEmpty, IsArray, ValidateNested, ArrayMinSize, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class AssignmentQuestionDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsArray()
  @ArrayMinSize(1)
  options!: string[];
}

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  teacherId!: string;

  @IsString()
  @IsNotEmpty()
  teacherName!: string;

  @IsString()
  @IsNotEmpty()
  studentId!: string;

  @IsString()
  @IsNotEmpty()
  studentName!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AssignmentQuestionDto)
  questions!: AssignmentQuestionDto[];

  @IsOptional()
  @IsString()
  status?: 'assigned' | 'submitted';
}
