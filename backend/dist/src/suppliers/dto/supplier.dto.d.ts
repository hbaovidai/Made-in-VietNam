export type SupplierVerificationStatus = 'UNVERIFIED' | 'VERIFIED';
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
    taxCode?: string;
    companyEmail?: string;
    companyPhone?: string;
    legalRepresentative?: string;
    businessLicenseUrl?: string;
    identityCardUrl?: string;
    verificationStatus?: SupplierVerificationStatus;
    industries?: string[];
    markets?: string[];
}
export declare class SupplierQueryDto {
    search?: string;
    industry?: string;
    page?: number;
    limit?: number;
    verificationStatus?: SupplierVerificationStatus;
}
