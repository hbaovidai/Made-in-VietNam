import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto, CreateFakeSuppDto } from './dto/supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class SuppliersController {
    private suppliersService;
    private prisma;
    private auditLogService;
    constructor(suppliersService: SuppliersService, prisma: PrismaService, auditLogService: AuditLogService);
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
            salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
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
    findBySlug(slug: string): Promise<{
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
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            brand: string | null;
            customizations: string[];
            exportMarkets: string | null;
            leadTime: string | null;
            origin: string | null;
            port: string | null;
            productionCapacity: string | null;
            sku: string | null;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    findAddressBySlug(slug: string, findPrimary?: boolean): Promise<{
        found: boolean;
        addresses: {
            isPrimary: boolean;
            address: string;
        }[];
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    getStats(id: string): Promise<{
        products: number;
        batches: number;
        qrCodes: number;
        totalViews: number;
    }>;
    getAnalytics(id: string, userId: string): Promise<{
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
    createMyProfile(dto: any, userId: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    verifySupplier(id: string, isVerified: boolean, adminId: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    update(id: string, dto: UpdateSupplierDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            brand: string | null;
            customizations: string[];
            exportMarkets: string | null;
            leadTime: string | null;
            origin: string | null;
            port: string | null;
            productionCapacity: string | null;
            sku: string | null;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        isFake: boolean | null;
    }>;
    addCertification(id: string, body: {
        name: string;
        issuedBy?: string;
        documentUrl?: string;
    }, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        name: string;
        supplierId: string;
        issuedBy: string | null;
        issuedDate: Date | null;
        expiryDate: Date | null;
        documentUrl: string | null;
    }>;
    deleteCertification(supplierId: string, certId: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
    createFakeSupp(dto: CreateFakeSuppDto): Promise<{
        message: any;
        success: boolean;
    }>;
    addUpgradeFormMan(dto: CreateFakeSuppDto): Promise<{
        message: any;
        success: boolean;
    }>;
    addupgradeFormExp(dto: CreateFakeSuppDto): Promise<{
        message: any;
        success: boolean;
    }>;
}
