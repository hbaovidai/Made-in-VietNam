import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query?: any): Promise<{
        data: {
            id: string;
            createdAt: Date;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            phone: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            supplier: {
                id: string;
                companyName: string;
                isVerified: boolean;
            } | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getSavedProducts(userId: string): Promise<any[]>;
    saveProduct(userId: string, productId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
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
