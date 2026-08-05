import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateTeacherDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  qualification?: string;
}