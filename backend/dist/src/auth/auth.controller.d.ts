import { AuthService } from './auth.service';
import { UserRegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto, GoogleLoginDto, SupplierRegisterDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    googleLogin(dto: GoogleLoginDto): Promise<{
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
    getProfile(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
