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
                createdAt: Date;
                updatedAt: Date;
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
                verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
                userId: string;
            } | null;
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            createdAt: Date;
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
                is_verified: boolean | null;
                verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
    googleLogin(dto: GoogleLoginDto): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                companyName: string;
                slug: string;
                is_verified: boolean | null;
                verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
    getProfile(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        fullName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        supplier: {
            id: string;
            companyName: string;
            slug: string;
            logo: string | null;
            is_verified: boolean | null;
            verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        } | null;
    }>;
    updateProfile(id: string, dto: UpdateProfileDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
    changePassword(id: string, dto: ChangePasswordDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
}
