import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            companyName: string;
            slug: string;
            logo: string | null;
            banner: string | null;
            description: string | null;
            businessType: string | null;
            yearEstablished: number | null;
            employeeCount: string | null;
            address: string | null;
            city: string | null;
            province: string | null;
            website: string | null;
            taxCode: string | null;
            companyEmail: string | null;
            companyPhone: string | null;
            legalRepresentative: string | null;
            businessLicenseUrl: string | null;
            identityCardUrl: string | null;
            verificationStatus: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
            isVerified: boolean | null;
            userId: string;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slugOrId: string): Promise<{
        user: {
            email: string;
            fullName: string;
        };
        _count: {
            products: number;
        };
        products: ({
            category: {
                slug: string;
                name: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            supplierId: string;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            categoryId: string;
            images: string[];
            rating: number;
            reviewCount: number;
            viewCount: number;
            rfqMinQuantity: number | null;
            origin: string | null;
            leadTime: string | null;
            brand: string | null;
            sku: string | null;
            productionCapacity: string | null;
            port: string | null;
            exportMarkets: string | null;
            attributes: Prisma.JsonValue | null;
            customizations: string[];
            specifications: Prisma.JsonValue | null;
        })[];
        certifications: {
            id: string;
            name: string;
            supplierId: string;
            issuedBy: string | null;
            issuedDate: Date | null;
            expiryDate: Date | null;
            documentUrl: string | null;
        }[];
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employeeCount: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legalRepresentative: string | null;
        businessLicenseUrl: string | null;
        identityCardUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        isVerified: boolean | null;
        userId: string;
    }>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employeeCount: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legalRepresentative: string | null;
        businessLicenseUrl: string | null;
        identityCardUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        isVerified: boolean | null;
        userId: string;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
        user: {
            email: string;
            fullName: string;
        };
        _count: {
            products: number;
        };
        products: ({
            category: {
                slug: string;
                name: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            supplierId: string;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            categoryId: string;
            images: string[];
            rating: number;
            reviewCount: number;
            viewCount: number;
            rfqMinQuantity: number | null;
            origin: string | null;
            leadTime: string | null;
            brand: string | null;
            sku: string | null;
            productionCapacity: string | null;
            port: string | null;
            exportMarkets: string | null;
            attributes: Prisma.JsonValue | null;
            customizations: string[];
            specifications: Prisma.JsonValue | null;
        })[];
        certifications: {
            id: string;
            name: string;
            supplierId: string;
            issuedBy: string | null;
            issuedDate: Date | null;
            expiryDate: Date | null;
            documentUrl: string | null;
        }[];
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employeeCount: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legalRepresentative: string | null;
        businessLicenseUrl: string | null;
        identityCardUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        isVerified: boolean | null;
        userId: string;
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
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
        slug: string;
        logo: string | null;
        banner: string | null;
        description: string | null;
        businessType: string | null;
        yearEstablished: number | null;
        employeeCount: string | null;
        address: string | null;
        city: string | null;
        province: string | null;
        website: string | null;
        taxCode: string | null;
        companyEmail: string | null;
        companyPhone: string | null;
        legalRepresentative: string | null;
        businessLicenseUrl: string | null;
        identityCardUrl: string | null;
        verificationStatus: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
        isVerified: boolean | null;
        userId: string;
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
