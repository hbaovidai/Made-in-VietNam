import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        message: string;
        user: {
            supplier: {
                id: string;
                slug: string;
                companyName: string;
                isVerified: boolean;
            } | null;
            id: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            updatedAt: Date;
        };
    }>;
    getProfile(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        fullName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        supplier: {
            id: string;
            slug: string;
            companyName: string;
            logo: string | null;
            isVerified: boolean;
        } | null;
    }>;
    updateProfile(id: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            id: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            avatar: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
        };
    }>;
    changePassword(id: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
