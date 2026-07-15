import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto, CreateFakeSuppDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: ({
            industries: {
                industry: string;
            }[];
            markets: {
                market: string;
            }[];
            addresses: {
                isPrimary: boolean;
                supplierSlug: string;
                address: string;
            }[];
            categories: {
                categorySlug: string;
                createdAt: Date;
                updatedAt: Date;
                supplierSlug: string;
                categoryLevel: number;
            }[];
            channels: {
                createdAt: Date | null;
                updatedAt: Date | null;
                supplierSlug: string;
                url: string;
                type: import("@prisma/client").$Enums.SaleChannelType;
            }[];
            manufacturerProfile: {
                id: string;
            } | null;
            exporterProfile: {
                id: string;
            } | null;
        } & {
            companyName: string;
            description: string | null;
            logo: string | null;
            banner: string | null;
            businessType: import("@prisma/client").$Enums.BusinessType | null;
            yearEstablished: number | null;
            employee_count: string | null;
            website: string | null;
            taxCode: string | null;
            legalRepName: string | null;
            businessLicenseUrl: string[];
            status: import("@prisma/client").$Enums.SupplierStatus;
            id: string;
            slug: string;
            contactPhone: string | null;
            contactEmail: string | null;
            accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
            supplierType: import("@prisma/client").$Enums.SupplierType | null;
            userId: string;
            accountHolderName: string | null;
            authorizationLetterUrl: string[];
            legalRepGovId: string | null;
            legalRepGovIdUrl: string[];
            salesChannels: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
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
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
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
            description: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            supplierId: string;
            nameEn: string | null;
            viewCount: number;
            minPrice: number;
            maxPrice: number;
            moq: number;
            rating: number;
            reviewCount: number;
            rfqMinQuantity: number | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
            currency: string;
            unit: string;
            moqUnit: string;
            categoryId: string;
            images: string[];
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
        categories: {
            categorySlug: string;
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            supplierSlug: string;
            url: string;
            type: import("@prisma/client").$Enums.SaleChannelType;
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
        companyName: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        yearEstablished: number | null;
        employee_count: string | null;
        website: string | null;
        taxCode: string | null;
        legalRepName: string | null;
        businessLicenseUrl: string[];
        status: import("@prisma/client").$Enums.SupplierStatus;
        id: string;
        slug: string;
        contactPhone: string | null;
        contactEmail: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        userId: string;
        accountHolderName: string | null;
        authorizationLetterUrl: string[];
        legalRepGovId: string | null;
        legalRepGovIdUrl: string[];
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    findBySlugAdmin(slugOrId: string): Promise<{
        addresses: {
            isPrimary: boolean;
            address: string;
        }[];
        categories: {
            categorySlug: string;
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            supplierSlug: string;
            url: string;
            type: import("@prisma/client").$Enums.SaleChannelType;
        }[];
    } & {
        companyName: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        yearEstablished: number | null;
        employee_count: string | null;
        website: string | null;
        taxCode: string | null;
        legalRepName: string | null;
        businessLicenseUrl: string[];
        status: import("@prisma/client").$Enums.SupplierStatus;
        id: string;
        slug: string;
        contactPhone: string | null;
        contactEmail: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        userId: string;
        accountHolderName: string | null;
        authorizationLetterUrl: string[];
        legalRepGovId: string | null;
        legalRepGovIdUrl: string[];
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    createProfile(userId: string, data: any): Promise<{
        companyName: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        yearEstablished: number | null;
        employee_count: string | null;
        website: string | null;
        taxCode: string | null;
        legalRepName: string | null;
        businessLicenseUrl: string[];
        status: import("@prisma/client").$Enums.SupplierStatus;
        id: string;
        slug: string;
        contactPhone: string | null;
        contactEmail: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        userId: string;
        accountHolderName: string | null;
        authorizationLetterUrl: string[];
        legalRepGovId: string | null;
        legalRepGovIdUrl: string[];
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    createFakeProfile(dto: CreateFakeSuppDto): Promise<{
        message: any;
        success: boolean;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
        industries: {
            industry: string;
        }[];
        markets: {
            market: string;
        }[];
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
            description: string | null;
            status: import("@prisma/client").$Enums.ProductStatus;
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            supplierId: string;
            nameEn: string | null;
            viewCount: number;
            minPrice: number;
            maxPrice: number;
            moq: number;
            rating: number;
            reviewCount: number;
            rfqMinQuantity: number | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
            currency: string;
            unit: string;
            moqUnit: string;
            categoryId: string;
            images: string[];
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
        categories: {
            categorySlug: string;
            createdAt: Date;
            updatedAt: Date;
            supplierSlug: string;
            categoryLevel: number;
        }[];
        channels: {
            createdAt: Date | null;
            updatedAt: Date | null;
            supplierSlug: string;
            url: string;
            type: import("@prisma/client").$Enums.SaleChannelType;
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
        companyName: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        yearEstablished: number | null;
        employee_count: string | null;
        website: string | null;
        taxCode: string | null;
        legalRepName: string | null;
        businessLicenseUrl: string[];
        status: import("@prisma/client").$Enums.SupplierStatus;
        id: string;
        slug: string;
        contactPhone: string | null;
        contactEmail: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        userId: string;
        accountHolderName: string | null;
        authorizationLetterUrl: string[];
        legalRepGovId: string | null;
        legalRepGovIdUrl: string[];
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
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
        companyName: string;
        description: string | null;
        logo: string | null;
        banner: string | null;
        businessType: import("@prisma/client").$Enums.BusinessType | null;
        yearEstablished: number | null;
        employee_count: string | null;
        website: string | null;
        taxCode: string | null;
        legalRepName: string | null;
        businessLicenseUrl: string[];
        status: import("@prisma/client").$Enums.SupplierStatus;
        id: string;
        slug: string;
        contactPhone: string | null;
        contactEmail: string | null;
        accountHolderRole: import("@prisma/client").$Enums.SupplierAccountHolderRole | null;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        userId: string;
        accountHolderName: string | null;
        authorizationLetterUrl: string[];
        legalRepGovId: string | null;
        legalRepGovIdUrl: string[];
        salesChannels: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
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
