import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsNumber,
  IsArray,
} from 'class-validator';
import {
  Role, SupplierAccountHolderRole, SupplierStatus, SupplierType, UserStatus,
  BusinessType
} from '@prisma/client';
import { DefaultValuePipe } from '@nestjs/common';

export class UserRegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên không được để trống' })
  fullName: string;

  @IsIn(['BUYER', 'SUPPLIER'], { message: 'Role phải là BUYER hoặc SUPPLIER' })
  role: Role;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}

export class LoginDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu cũ không được để trống' })
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
  newPassword: string;
}

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  credential: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  picture?: string;
}

// ---- supplier auth dto ---- //
export class SupplierRegisterDto {
  @IsString() accountHolderGovId: string;
  @IsString() accountHolderPhone: string;
  @IsString() accountHolderEmail: string;
  @IsArray() accountHolderGovIdUrl: string[];
  @IsArray() authorizationLetterUrl: string[];
  @IsEnum(SupplierAccountHolderRole) accountHolderRole: SupplierAccountHolderRole;

  @IsString() companyName: string;
  @IsEnum(BusinessType) businessType: BusinessType;
  @IsArray() businessLicenseUrl: string[];

  @IsString() taxCode: string;
  @IsString() legalRepName: string;
  @IsString() legalRepPhone: string;
  @IsString() province: string;
  @IsString() district: string;
  @IsString() ward: string;
  @IsString() streetAddress: string;

  @IsEnum(SupplierType) supplierType: SupplierType;
}
