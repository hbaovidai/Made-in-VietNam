import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: {
            id: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            userId: string;
            contactEmail: string | null;
            contactPhone: string | null;
            accountHolderName: string | null;
            accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
            authorizationLetterUrl: string[];
            companyName: string;
            taxCode: string | null;
            businessType: string | null;
            legalRepName: string | null;
            legalRepGovId: string | null;
            province: string | null;
            ward: string | null;
            streetAddress: string | null;
            businessLicenseUrl: string[];
            legalRepGovIdUrl: string[];
            logo: string | null;
            banner: string | null;
            description: string | null;
            employee_count: string | null;
            yearEstablished: number | null;
            website: string | null;
            salesChannels: Prisma.JsonValue | null;
            supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
                name: string;
                slug: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            nameEn: string | null;
            supplierId: string;
            descriptionEn: string | null;
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
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: string | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        province: string | null;
        ward: string | null;
        streetAddress: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
    }>;
    findBySlugAdmin(slugOrId: string): Promise<{
        status: import("@prisma/client").$Enums.SupplierStatus;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: string | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        province: string | null;
        ward: string | null;
        streetAddress: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
    }>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: string | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        province: string | null;
        ward: string | null;
        streetAddress: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
                name: string;
                slug: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            nameEn: string | null;
            supplierId: string;
            descriptionEn: string | null;
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
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: string | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        province: string | null;
        ward: string | null;
        streetAddress: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
        status: import("@prisma/client").$Enums.SupplierStatus;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: string | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        province: string | null;
        ward: string | null;
        streetAddress: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
