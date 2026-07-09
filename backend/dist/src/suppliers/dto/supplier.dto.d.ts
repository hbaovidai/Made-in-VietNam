import { BusinessType, SupplierStatus } from '@prisma/client';
export declare class UpdateSupplierDto {
    companyName?: string;
    description?: string;
    logo?: string;
    banner?: string;
    businessType?: BusinessType;
    yearEstablished?: number;
    employeeCount?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    website?: string;
    taxCode?: string;
    companyEmail?: string;
    companyPhone?: string;
    legalRepName?: string;
    legalRepPhone?: string;
    businessLicenseUrl?: string[];
    identityCardUrl?: string;
    status?: SupplierStatus;
    industries?: string[];
    markets?: string[];
}
export declare class SupplierQueryDto {
    search?: string;
    industry?: string;
    page?: number;
    limit?: number;
    businessType?: BusinessType;
    status?: SupplierStatus;
}
export declare class AdminQueryDto {
    slugOrId?: string;
    status?: SupplierStatus;
    include?: UpdateSupplierDto;
}
