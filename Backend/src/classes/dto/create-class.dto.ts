import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  class_name: string;

  @IsString()
  @IsNotEmpty()
  section: string;


  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsOptional()
  teacherId?: string;
}