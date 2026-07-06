import { SupplierApplicationService } from './supplier_app.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { SupplierApplicationStatus } from './supplier_app.service';
export declare class SupplierApplicationController {
    private readonly suppAppService;
    constructor(suppAppService: SupplierApplicationService);
    getAllApplications(query: SupplierApplicationDto): Promise<{
        data: any;
        meta: {
            total_apps_count: any;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    deleteApplication(id: number): Promise<any>;
    updateApplicationStatus(id: number, newStatus: SupplierApplicationStatus): Promise<any>;
}
