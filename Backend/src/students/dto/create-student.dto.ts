import { IsString, IsNotEmpty, IsEmail, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  @IsNotEmpty()
  rollNo!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  class!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDateString()
  @IsOptional()
  dob?: string;
}