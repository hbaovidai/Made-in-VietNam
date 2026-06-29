import { PrismaService } from 'src/prisma/prisma.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
export declare enum SupplierApplicationStatus {
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    APPROVED = "APPROVED"
}
export declare class SupplierApplicationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierApplicationDto): Promise<{
        data: {
            id: number;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            createdAt: Date;
            lastName: string;
            firstName: string;
            applicantRole: import("@prisma/client").$Enums.SupplierApplicantRole;
            govId: string;
            govIdPicUrl: string[];
        }[];
        meta: {
            total_apps_count: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    deleteApplication(id: number): Promise<{
        success: boolean;
        deletedUser: {
            id: number;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            createdAt: Date;
            lastName: string;
            firstName: string;
            applicantRole: import("@prisma/client").$Enums.SupplierApplicantRole;
            govId: string;
            govIdPicUrl: string[];
        };
        reason?: undefined;
    } | {
        success: boolean;
        reason: string;
        deletedUser?: undefined;
    }>;
    updateApplicationStatus(id: number, newStatus: SupplierApplicationStatus): Promise<{
        success: boolean;
        updatedApplication: {
            id: number;
            email: string;
            phone: string;
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            createdAt: Date;
            lastName: string;
            firstName: string;
            applicantRole: import("@prisma/client").$Enums.SupplierApplicantRole;
            govId: string;
            govIdPicUrl: string[];
        };
        reason?: undefined;
    } | {
        success: boolean;
        reason: string;
        updatedApplication?: undefined;
    }>;
}
