import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto, GoogleLoginDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleLogin(dto: GoogleLoginDto): Promise<{
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
    getProfile(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
    updateProfile(id: string, dto: UpdateProfileDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
    changePassword(id: string, dto: ChangePasswordDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
