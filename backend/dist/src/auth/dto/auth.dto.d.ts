import { Role, SupplierAccountHolderRole, SupplierType, UserStatus, BusinessType } from '@prisma/client';
export declare class UserRegisterDto {
    email: string;
    password?: string;
    fullName: string;
    role: Role;
    phone?: string;
    status?: UserStatus;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class UpdateProfileDto {
    fullName?: string;
    phone?: string;
    avatar?: string;
}
export declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
}
export declare class GoogleLoginDto {
    credential: string;
    email: string;
    name: string;
    picture?: string;
}
export declare class SupplierRegisterDto {
    companyName: string;
    taxCode: string;
    legalRepName: string;
    legalRepGovId: string;
    province: string;
    ward: string;
    streetAddress: string;
    businessType: BusinessType;
    legalRepGovIdUrl: string[];
    businessLicenseUrl: string[];
    accountHolderName: string;
    contactPhone: string;
    contactEmail: string;
    accountHolderRole: SupplierAccountHolderRole;
    authorizationLetterUrl: string[];
    supplierType: SupplierType;
    extraDocsUrl: string[];
}
