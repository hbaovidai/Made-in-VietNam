import { SupplierApplicationService } from './supplier_app.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { SupplierApplicationStatus } from './supplier_app.service';
export declare class SupplierApplicationController {
    private readonly suppAppService;
    constructor(suppAppService: SupplierApplicationService);
    getAllApplications(query: SupplierApplicationDto): Promise<{
        data: {
            id: number;
            createdAt: Date;
            status: import("@prisma/client").$Enums.SupplierApplicationStatus;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
            ApplicantRole: import("@prisma/client").$Enums.SupplierApplicationRole;
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
    deleteApplication(id: number): Promise<any>;
    updateApplicationStatus(id: number, newStatus: SupplierApplicationStatus): Promise<any>;
}
