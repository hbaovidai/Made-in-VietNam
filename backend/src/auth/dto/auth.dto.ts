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

  @IsIn([Role.BUYER, Role.SUPPLIER], { message: 'Role phải là BUYER hoặc SUPPLIER' })
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
  // legal info
  @IsString() companyName: string;
  @IsString() taxCode: string;
  @IsString() legalRepName: string;
  @IsString() legalRepGovId: string;
  @IsString() primaryLocation: string;
  @IsEnum(BusinessType) businessType: BusinessType;

  @IsString({each: true}) legalRepGovIdUrl: string[];
  @IsString({each: true}) businessLicenseUrl: string[];

  // contact info
  @IsString() accountHolderName: string;
  @IsString() contactPhone: string;
  @IsString() contactEmail: string;
  @IsEnum(SupplierAccountHolderRole) accountHolderRole: SupplierAccountHolderRole;
  @IsString({ each: true }) @IsOptional() authorizationLetterUrl: string[];

  // other info
  @IsEnum(SupplierType) supplierType: SupplierType;
  @IsString({each: true}) @IsOptional() extraDocsUrl: string[];
}

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã xác thực OTP không được để trống' })
  resetCode: string;

  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới tối thiểu 6 ký tự' })
  newPassword: string;
}
