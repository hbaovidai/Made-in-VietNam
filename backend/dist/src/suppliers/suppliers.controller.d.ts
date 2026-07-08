import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class SuppliersController {
    private suppliersService;
    private prisma;
    private auditLogService;
    constructor(suppliersService: SuppliersService, prisma: PrismaService, auditLogService: AuditLogService);
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
            salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
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
    findBySlug(slug: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    verifySupplier(id: string, isVerified: boolean, adminId: string): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
    }>;
    update(id: string, dto: UpdateSupplierDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
        salesChannels: import("@prisma/client/runtime/library").JsonValue | null;
        is_verified: boolean | null;
        createdAt: Date;
        updatedAt: Date;
        verification_status: import("@prisma/client").$Enums.SupplierVerificationStatus | null;
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
}
