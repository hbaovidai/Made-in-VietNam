import { IsOptional, IsString, IsInt, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSupplierDto {
  @IsString() @IsOptional() companyName?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() logo?: string;
  @IsString() @IsOptional() banner?: string;
  @IsString() @IsOptional() businessType?: string;
  @IsInt() @IsOptional() @Type(() => Number) yearEstablished?: number;
  @IsString() @IsOptional() employeeCount?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() province?: string;
  @IsString() @IsOptional() website?: string;
  @IsArray() @IsString({ each: true }) @IsOptional() industries?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() markets?: string[];
}

export class SupplierQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @Type(() => Number) @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @Min(1) limit?: number = 20;
}
