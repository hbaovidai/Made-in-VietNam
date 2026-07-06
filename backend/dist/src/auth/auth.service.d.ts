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
                employee_count: string | null;
                streetAddress: string | null;
                city: string | null;
                province: string | null;
                website: string | null;
                taxCode: string | null;
                companyEmail: string | null;
                companyPhone: string | null;
                legal_representative: string | null;
                businessLicenseUrl: string | null;
                identity_card_url: string | null;
                salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
                is_verified: boolean | null;
                createdAt: Date;
                updatedAt: Date;
                verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
            } | null;
            id: string;
            createdAt: Date;
            email: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
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
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
        phone: string | null;
        avatar: string | null;
        passwordHash: string;
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
