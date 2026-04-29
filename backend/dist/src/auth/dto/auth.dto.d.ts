import { Role } from '@prisma/client';
export declare class RegisterDto {
    email: string;
    password: string;
    fullName: string;
    role: Role;
    phone?: string;
    companyName?: string;
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
