import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto, CreateFakeSuppDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: ({
            addresses: {
                isPrimary: boolean;
                supplierSlug: string;
                address: string;
            }[];
            industries: {
                industry: string;
            }[];
            markets: {
                market: string;
            }[];
            categories: {
                createdAt: Date;
                updatedAt: Date;
                supplierSlug: string;
                categorySlug: string;
                categoryLevel: number;
            }[];
            channels: {
                createdAt: Date | null;
                updatedAt: Date | null;
                type: import("@prisma/client").$Enums.SaleChannelType;
                supplierSlug: string;
                url: string;
            }[];
            manufacturerProfile: {
                id: string;
            } | null;
            exporterProfile: {
                id: string;
            } | null;
        } & {
            id: string;
            slug: string;
            userId: string;
            contactEmail: string | null;
            contactPhone: string | null;
            accountHolderName: string | null;
            accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
            authorizationLetterUrl: string[];
            companyName: string;
            taxCode: string | null;
            businessType: import("@prisma/client").$Enums.BusinessType | null;
            legalRepName: string | null;
            legalRepGovId: string | null;
            businessLicenseUrl: string[];
            legalRepGovIdUrl: string[];
            logo: string | null;
            banner: string | null;
            description: string | null;
            employee_count: string | null;
            yearEstablished: number | null;
            website: string | null;
            salesChannels: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.SupplierStatus;
            supplierType: import("@prisma/client").$Enums.SupplierType | null;
            isFake: boolean | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slugOrId: string): Promise<{
        addresses: {
            isPrimary: boolean;
            address: string;
        }[];
        user: {
            email: string;
            fullName: string;
        };
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
            status: import("@prisma/client").$Enums.ProductStatus;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
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
            supplierId: string;
            categoryId: string;
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
        categories: {
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categorySlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            type: import("@prisma/client").$Enums.SaleChannelType;
            supplierSlug: string;
            url: string;
        }[];
        manufacturerProfile: {
            id: string;
        } | null;
        exporterProfile: {
            id: string;
        } | null;
        _count: {
            products: number;
        };
    } & {
        id: string;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
    }>;
    findBySlugAdmin(slugOrId: string): Promise<{
        addresses: {
            isPrimary: boolean;
            address: string;
        }[];
        categories: {
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categorySlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            type: import("@prisma/client").$Enums.SaleChannelType;
            supplierSlug: string;
            url: string;
        }[];
    } & {
        id: string;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
    }>;
    createProfile(userId: string, data: any): Promise<{
        id: string;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
    }>;
    createFakeProfile(dto: CreateFakeSuppDto): Promise<{
        message: any;
        success: boolean;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
        addresses: {
            isPrimary: boolean;
            address: string;
        }[];
        user: {
            email: string;
            fullName: string;
        };
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
            status: import("@prisma/client").$Enums.ProductStatus;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
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
            supplierId: string;
            categoryId: string;
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
        categories: {
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categorySlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            type: import("@prisma/client").$Enums.SaleChannelType;
            supplierSlug: string;
            url: string;
        }[];
        manufacturerProfile: {
            id: string;
        } | null;
        exporterProfile: {
            id: string;
        } | null;
        _count: {
            products: number;
        };
    } & {
        id: string;
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
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
        slug: string;
        userId: string;
        contactEmail: string | null;
        contactPhone: string | null;
        accountHolderName: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        authorizationLetterUrl: string[];
        companyName: string;
        taxCode: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        legalRepName: string | null;
        legalRepGovId: string | null;
        businessLicenseUrl: string[];
        legalRepGovIdUrl: string[];
        logo: string | null;
        banner: string | null;
        description: string | null;
        employee_count: string | null;
        yearEstablished: number | null;
        website: string | null;
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
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
