import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(query: any): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                role: import("@prisma/client").$Enums.Role;
                fullName: string;
                avatar: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
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
