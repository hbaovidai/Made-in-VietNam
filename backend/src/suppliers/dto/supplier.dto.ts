import { IsOptional, IsString, IsInt, IsArray, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessType, SupplierStatus } from '@prisma/client';

export class UpdateSupplierDto {
  @IsString() @IsOptional() companyName?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() logo?: string;
  @IsString() @IsOptional() banner?: string;
  @IsEnum(BusinessType) @IsOptional() businessType?: BusinessType;
  @IsInt() @IsOptional() @Type(() => Number) yearEstablished?: number;
  @IsString() @IsOptional() employeeCount?: string;
  @IsString() @IsOptional() streetAddress?: string;
  @IsString() @IsOptional() city?: string;
  @IsString() @IsOptional() province?: string;
  @IsString() @IsOptional() website?: string;
  @IsString() @IsOptional() taxCode?: string;
  @IsString() @IsOptional() companyEmail?: string;
  @IsString() @IsOptional() companyPhone?: string;
  @IsString() @IsOptional() legalRepName?: string;
  @IsString() @IsOptional() legalRepPhone?: string;
  @IsString() @IsString({ each: true }) businessLicenseUrl?: string[];
  @IsString() @IsOptional() identityCardUrl?: string;
  @IsEnum(SupplierStatus) @IsOptional() status?: SupplierStatus;
  @IsArray() @IsString({ each: true }) @IsOptional() industries?: string[];
  @IsArray() @IsString({ each: true }) @IsOptional() markets?: string[];
}

export class SupplierQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @Type(() => Number) @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @Min(1) limit?: number = 20;
  @IsEnum(BusinessType) @IsOptional() businessType?: BusinessType;
}
