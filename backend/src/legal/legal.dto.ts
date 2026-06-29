import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateLegalSectionDto {
  @IsOptional()
  @IsString()
  pageKey?: string;

  @IsString()
  titleVi: string;

  @IsString()
  titleEn: string;

  @IsString()
  slug: string;

  @IsString()
  contentVi: string;

  @IsString()
  contentEn: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLegalSectionDto {
  @IsOptional()
  @IsString()
  pageKey?: string;

  @IsOptional()
  @IsString()
  titleVi?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  contentVi?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
