import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
export declare class SuppliersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: SupplierQueryDto): Promise<{
        data: ({
            certifications: {
                name: string;
            }[];
            industries: {
                industry: string;
            }[];
            markets: {
                market: string;
            }[];
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
            verificationStatus: string;
            isVerified: boolean;
            createdAt: Date;
            updatedAt: Date;
        })[];
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
            supplierId: string;
            name: string;
            status: import("@prisma/client").$Enums.ProductStatus;
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
        })[];
        certifications: {
            id: string;
            supplierId: string;
            name: string;
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
        verificationStatus: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        verificationStatus: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
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
            supplierId: string;
            name: string;
            status: import("@prisma/client").$Enums.ProductStatus;
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
        })[];
        certifications: {
            id: string;
            supplierId: string;
            name: string;
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
        verificationStatus: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addCertification(supplierId: string, data: {
        name: string;
        issuedBy?: string;
        documentUrl?: string;
    }): Promise<{
        id: string;
        supplierId: string;
        name: string;
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
        verificationStatus: string;
        isVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
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
