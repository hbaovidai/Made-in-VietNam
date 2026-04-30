import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private googleClient;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    private generateToken;
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                userId: string;
                companyName: string;
                slug: string;
                logo: string | null;
                banner: string | null;
                description: string | null;
                businessType: string | null;
                yearEstablished: number | null;
                employeeCount: string | null;
                address: string | null;
                city: string | null;
                province: string | null;
                website: string | null;
                taxCode: string | null;
                companyEmail: string | null;
                companyPhone: string | null;
                legalRepresentative: string | null;
                businessLicenseUrl: string | null;
                identityCardUrl: string | null;
                verificationStatus: string;
                isVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            id: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                companyName: string;
                slug: string;
                isVerified: boolean;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
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
                companyName: string;
                slug: string;
                isVerified: boolean;
            } | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
        };
        token: string;
    }>;
    getProfile(userId: string): Promise<{
        supplier: {
            id: string;
            companyName: string;
            slug: string;
            logo: string | null;
            isVerified: boolean;
        } | null;
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        fullName: string;
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
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
