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
            addresses: {
                isPrimary: boolean;
                supplierSlug: string;
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
            salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
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
    findBySlug(slug: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
    }>;
    verifySupplier(id: string, isVerified: boolean, adminId: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
        isFake: boolean | null;
    }>;
    update(id: string, dto: UpdateSupplierDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.SupplierStatus;
        supplierType: import("@prisma/client").$Enums.SupplierType | null;
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
