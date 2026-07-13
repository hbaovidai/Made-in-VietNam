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
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            createdAt: Date;
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
                status: import("@prisma/client").$Enums.SupplierStatus;
                slug: string;
                companyName: string;
            } | null;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
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
                status: import("@prisma/client").$Enums.SupplierStatus;
                slug: string;
                companyName: string;
            } | null;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
            updatedAt: Date;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        supplier: {
            id: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            slug: string;
            companyName: string;
            logo: string | null;
        } | null;
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        fullName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            createdAt: Date;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
