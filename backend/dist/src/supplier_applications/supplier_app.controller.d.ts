import { SupplierApplicationService } from './supplier_app.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { SupplierApplicationStatus } from './supplier_app.service';
export declare class SupplierApplicationController {
    private readonly suppAppService;
    constructor(suppAppService: SupplierApplicationService);
    getAllApplications(query: SupplierApplicationDto): Promise<{
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
    deleteApplication(id: number): Promise<any>;
    updateApplicationStatus(id: number, newStatus: SupplierApplicationStatus): Promise<any>;
}
