import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  questionVi: string;

  @IsString()
  answerVi: string;

  @IsString()
  questionEn: string;

  @IsString()
  answerEn: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  questionVi?: string;

  @IsOptional()
  @IsString()
  answerVi?: string;

  @IsOptional()
  @IsString()
  questionEn?: string;

  @IsOptional()
  @IsString()
  answerEn?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
