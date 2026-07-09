import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UserRegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto, SupplierRegisterDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    private generateToken;
    register(dto: UserRegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
        token: string;
    }>;
    supplierRegister(dto: SupplierRegisterDto): Promise<{
        message: any;
        success: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                slug: string;
                companyName: string;
                status: import("@prisma/client").$Enums.SupplierStatus;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            avatar: string | null;
        };
        token: string;
    }>;
    googleLogin(data: {
        credential: string;
        email: string;
        name: string;
        picture?: string;
    }): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                slug: string;
                companyName: string;
                status: import("@prisma/client").$Enums.SupplierStatus;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            avatar: string | null;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        supplier: {
            id: string;
            slug: string;
            companyName: string;
            logo: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
        } | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        avatar: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
            avatar: string | null;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
