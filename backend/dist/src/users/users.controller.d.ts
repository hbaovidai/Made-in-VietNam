import { UsersService } from './users.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class UsersController {
    private readonly usersService;
    private readonly auditLogService;
    constructor(usersService: UsersService, auditLogService: AuditLogService);
    getAllUsers(query: any): Promise<{
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
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            phone: string | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    toggleUserStatus(id: string, status: 'ACTIVE' | 'SUSPENDED', adminId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.UserStatus;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
    deleteUser(id: string, adminId: string): Promise<{
        message: string;
    }>;
    getSavedProducts(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<any[]>;
    saveProduct(id: string, productId: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        productId: string;
    } | {
        success: boolean;
    }>;
    unsaveProduct(id: string, productId: string, userId: string): Promise<{
        success: boolean;
    }>;
    clearSavedProducts(id: string, userId: string): Promise<{
        success: boolean;
    }>;
    getViewHistory(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<any[]>;
    recordView(id: string, productId: string, userId: string): Promise<{
        id: string;
        userId: string;
        productId: string;
        viewedAt: Date;
    }>;
    deleteHistoryItem(id: string, historyId: string, userId: string): Promise<{
        success: boolean;
    }>;
    clearHistory(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
