import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        data: {
            supplier: {
                id: string;
                companyName: string;
                isVerified: boolean;
            } | null;
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.UserStatus;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    toggleUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED'): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        role: import("@prisma/client").$Enums.Role;
        fullName: string;
    }>;
    deleteUser(userId: string): Promise<{
        id: string;
        fullName: string;
        email: string;
    }>;
    getSavedProducts(userId: string): Promise<any[]>;
    saveProduct(userId: string, productId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        productId: string;
    } | {
        success: boolean;
    }>;
    unsaveProduct(userId: string, productId: string): Promise<{
        success: boolean;
    }>;
    clearSavedProducts(userId: string): Promise<{
        success: boolean;
    }>;
    getViewHistory(userId: string): Promise<any[]>;
    recordView(userId: string, productId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
        viewedAt: Date;
    }>;
    deleteHistoryItem(userId: string, historyId: string): Promise<{
        success: boolean;
    }>;
    clearHistory(userId: string): Promise<{
        success: boolean;
    }>;
}
