import { AuthService } from './auth.service';
import { UserRegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto, GoogleLoginDto, SupplierRegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleLogin(dto: GoogleLoginDto): Promise<{
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
    getProfile(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
