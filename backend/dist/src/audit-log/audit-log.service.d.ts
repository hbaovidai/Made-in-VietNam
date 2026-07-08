import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    log(data: {
        userId: string;
        action: string;
        targetType: string;
        targetId?: string;
        targetName?: string;
        details?: string;
        ipAddress?: string;
    }): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        action: string;
        targetType: string;
        targetId: string | null;
        targetName: string | null;
        details: string | null;
        ipAddress: string | null;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        action?: string;
        userId?: string;
    }): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                fullName: string;
                role: import("@prisma/client").$Enums.Role;
                avatar: string | null;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            action: string;
            targetType: string;
            targetId: string | null;
            targetName: string | null;
            details: string | null;
            ipAddress: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
