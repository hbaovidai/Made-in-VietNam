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
