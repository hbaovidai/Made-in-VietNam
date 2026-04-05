export declare class UpdateSupplierDto {
    companyName?: string;
    description?: string;
    logo?: string;
    banner?: string;
    businessType?: string;
    yearEstablished?: number;
    employeeCount?: string;
    address?: string;
    city?: string;
    province?: string;
    website?: string;
    industries?: string[];
    markets?: string[];
}
export declare class SupplierQueryDto {
    search?: string;
    industry?: string;
    page?: number;
    limit?: number;
}
