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
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            email: string;
            phone: string;
            first_name: string;
            last_name: string;
            applicant_role: import("@prisma/client").$Enums.SupplierApplicantRole;
            gov_id: string;
            created_at: Date;
            gov_id_pic_url: string[];
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
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            email: string;
            phone: string;
            first_name: string;
            last_name: string;
            applicant_role: import("@prisma/client").$Enums.SupplierApplicantRole;
            gov_id: string;
            created_at: Date;
            gov_id_pic_url: string[];
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
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            email: string;
            phone: string;
            first_name: string;
            last_name: string;
            applicant_role: import("@prisma/client").$Enums.SupplierApplicantRole;
            gov_id: string;
            created_at: Date;
            gov_id_pic_url: string[];
        };
        reason?: undefined;
    } | {
        success: boolean;
        reason: string;
        updatedApplication?: undefined;
    }>;
}
