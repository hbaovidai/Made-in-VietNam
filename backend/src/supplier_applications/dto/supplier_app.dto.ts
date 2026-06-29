import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ApplicantRole {
  Owner = 'OWNER',
  LegalRep = 'LEGAL_REP',
  Manager = 'MANAGER',
  Employee = 'EMPLOYEE',
}

export class SupplierApplicationDto {
  @IsOptional() @IsNumber() id?: number;
  @IsOptional() @IsString() first_name?: string;
  @IsOptional() @IsString() last_name?: string;
  @IsOptional() @IsEnum(ApplicantRole) applicant_role?: ApplicantRole;
  @IsOptional() @IsString() gov_id?: string;
  @IsOptional() @IsArray() gov_id_url?: string[];
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
