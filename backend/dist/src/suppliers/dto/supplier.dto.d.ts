import { BusinessType, SupplierAccountHolderRole, SupplierStatus, SupplierType } from '@prisma/client';
export declare class UpdateSupplierDto {
    companyName?: string;
    description?: string;
    logo?: string;
    banner?: string;
    businessType?: BusinessType;
    yearEstablished?: number;
    employee_count?: string;
    primaryLocation?: string;
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
    categorySlug?: string;
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
export declare class CategoryOption {
    id: string;
    slug: string;
    name: string;
    included: boolean;
}
export declare class CreateFakeSuppDto {
    companyName: string;
    taxCode: string;
    primaryLocation: string;
    businessType: BusinessType;
    contactPhone: string;
    contactEmail: string;
    accountHolderRole: SupplierAccountHolderRole;
    supplierType: SupplierType;
    categoryOptions: CategoryOption[];
    website?: string;
    facebook?: string;
    instagram?: string;
    shopee?: string;
    logo: string;
    banner: string;
}
