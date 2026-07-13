import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(query: any): Promise<{
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
