import { SupplierApplicationService } from './supplier_app.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { SupplierStatus } from '@prisma/client';
export declare class SupplierApplicationController {
    private readonly suppAppService;
    constructor(suppAppService: SupplierApplicationService);
    getAllApplications(query: SupplierApplicationDto): Promise<{
        data: {
            id: string;
            slug: string;
            userId: string;
            contactEmail: string | null;
            contactPhone: string | null;
            accountHolderName: string | null;
            accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
            authorizationLetterUrl: string[];
            companyName: string;
            taxCode: string | null;
            businessType: import("@prisma/client").$Enums.BusinessType | null;
            legalRepName: string | null;
            legalRepGovId: string | null;
            businessLicenseUrl: string[];
            legalRepGovIdUrl: string[];
            logo: string | null;
            banner: string | null;
            description: string | null;
            employee_count: string | null;
            yearEstablished: number | null;
            website: string | null;
            salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.SupplierStatus;
            supplierType: import("@prisma/client").$Enums.SupplierType | null;
            isFake: boolean | null;
        }[];
        meta: {
            total_apps_count: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    deleteApplication(id: string): Promise<any>;
    updateApplicationStatus(id: string, newStatus: SupplierStatus): Promise<any>;
}
