import { IsArray, ValidateNested, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class AssignmentAnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId!: string;

  @IsString()
  @IsNotEmpty()
  selectedOption!: string;
}

export class SubmitAssignmentDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssignmentAnswerDto)
  answers!: AssignmentAnswerDto[];
}
