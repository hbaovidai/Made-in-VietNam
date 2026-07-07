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
            supplier: {
                id: string;
                companyName: string;
                slug: string;
                is_verified: boolean | null;
                verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
    getProfile(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        supplier: {
            id: string;
            companyName: string;
            slug: string;
            logo: string | null;
            is_verified: boolean | null;
            verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
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
