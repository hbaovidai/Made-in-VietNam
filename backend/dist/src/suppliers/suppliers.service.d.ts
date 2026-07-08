import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: {
            id: string;
            userId: string;
            companyName: string;
            slug: string;
            logo: string | null;
            banner: string | null;
            description: string | null;
            businessType: string | null;
            yearEstablished: number | null;
            employee_count: string | null;
            streetAddress: string | null;
            city: string | null;
            province: string | null;
            website: string | null;
            taxCode: string | null;
            companyEmail: string | null;
            companyPhone: string | null;
            legal_representative: string | null;
            businessLicenseUrl: string | null;
            identity_card_url: string | null;
            salesChannels: Prisma.JsonValue | null;
            is_verified: boolean | null;
            createdAt: Date;
            updatedAt: Date;
            verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slugOrId: string): Promise<{
        certifications: {
            id: string;
            name: string;
            supplierId: string;
            issuedBy: string | null;
            issuedDate: Date | null;
            expiryDate: Date | null;
            documentUrl: string | null;
        }[];
        products: ({
            category: {
                slug: string;
                name: string;
            };
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            images: string[];
            status: import("@prisma/client").$Enums.ProductStatus;
            rating: number;
            reviewCount: number;
            viewCount: number;
            rfqMinQuantity: number | null;
            attributes: Prisma.JsonValue | null;
            brand: string | null;
            customizations: string[];
            exportMarkets: string | null;
            leadTime: string | null;
            origin: string | null;
            port: string | null;
            productionCapacity: string | null;
            sku: string | null;
            specifications: Prisma.JsonValue | null;
            supplierId: string;
            categoryId: string;
        })[];
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
        user: {
            email: string;
            fullName: string;
        };
        _count: {
            products: number;
        };
    } & {
        id: string;
        userId: string;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employee_count: string | null;
        streetAddress: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legal_representative: string | null;
        businessLicenseUrl: string | null;
        identity_card_url: string | null;
        salesChannels: Prisma.JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        userId: string;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employee_count: string | null;
        streetAddress: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legal_representative: string | null;
        businessLicenseUrl: string | null;
        identity_card_url: string | null;
        salesChannels: Prisma.JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
        certifications: {
            id: string;
            name: string;
            supplierId: string;
            issuedBy: string | null;
            issuedDate: Date | null;
            expiryDate: Date | null;
            documentUrl: string | null;
        }[];
        products: ({
            category: {
                slug: string;
                name: string;
            };
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            images: string[];
            status: import("@prisma/client").$Enums.ProductStatus;
            rating: number;
            reviewCount: number;
            viewCount: number;
            rfqMinQuantity: number | null;
            attributes: Prisma.JsonValue | null;
            brand: string | null;
            customizations: string[];
            exportMarkets: string | null;
            leadTime: string | null;
            origin: string | null;
            port: string | null;
            productionCapacity: string | null;
            sku: string | null;
            specifications: Prisma.JsonValue | null;
            supplierId: string;
            categoryId: string;
        })[];
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
        user: {
            email: string;
            fullName: string;
        };
        _count: {
            products: number;
        };
    } & {
        id: string;
        userId: string;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employee_count: string | null;
        streetAddress: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legal_representative: string | null;
        businessLicenseUrl: string | null;
        identity_card_url: string | null;
        salesChannels: Prisma.JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    addCertification(supplierId: string, data: {
        name: string;
        issuedBy?: string;
        documentUrl?: string;
    }): Promise<{
        id: string;
        name: string;
        supplierId: string;
        issuedBy: string | null;
        issuedDate: Date | null;
        expiryDate: Date | null;
        documentUrl: string | null;
    }>;
    deleteCertification(certId: string, supplierId: string): Promise<{
        message: string;
    }>;
    verifySupplier(supplierId: string, isVerified: boolean): Promise<{
        id: string;
        userId: string;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employee_count: string | null;
        streetAddress: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legal_representative: string | null;
        businessLicenseUrl: string | null;
        identity_card_url: string | null;
        salesChannels: Prisma.JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    getStats(supplierId: string): Promise<{
        products: number;
        batches: number;
        qrCodes: number;
        totalViews: number;
    }>;
    getAnalytics(supplierId: string): Promise<{
        overview: {
            totalViews: number;
            totalProducts: number;
            activeProducts: number;
            avgViewsPerProduct: number;
        };
        dailyViews: {
            date: string;
            views: number;
        }[];
        monthlyViews: {
            month: string;
            views: number;
        }[];
        topProducts: {
            id: string;
            name: string;
            views: number;
            status: import("@prisma/client").$Enums.ProductStatus;
        }[];
    }>;
}
