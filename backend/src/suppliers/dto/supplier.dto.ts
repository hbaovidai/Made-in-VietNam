import { IsOptional, IsString, IsInt, IsArray, Min, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BusinessType, SupplierAccountHolderRole, SupplierStatus, SupplierType } from '@prisma/client';

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
  @IsString({ each: true }) @IsOptional() businessLicenseUrl?: string[];
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
  @IsOptional() @IsEnum(BusinessType) businessType?: BusinessType;
  @IsOptional() @IsEnum(SupplierStatus) status?: SupplierStatus;
}

export class AdminQueryDto {
  @IsOptional() @IsString() slugOrId?: string;
  @IsOptional() @IsEnum(SupplierStatus) status?: SupplierStatus;
  // this looks cursed, but it's just a set of attributes copied over from the database. literally
  @IsOptional() @ValidateNested() @Type(() => UpdateSupplierDto) include?: UpdateSupplierDto;
}

export class CreateFakeSuppDto {
  // legal info
  @IsString() companyName: string;
  @IsString() taxCode: string;
  @IsString() legalRepName: string;
  @IsString() legalRepGovId: string;
  @IsString() province: string;
  @IsString() ward: string;
  @IsString() streetAddress: string;
  @IsEnum(BusinessType) businessType: BusinessType;

  // contact info
  @IsString() accountHolderName: string;
  @IsString() contactPhone: string;
  @IsString() contactEmail: string;
  @IsEnum(SupplierAccountHolderRole) accountHolderRole: SupplierAccountHolderRole;

  // other info
  @IsEnum(SupplierType) supplierType: SupplierType;
}
