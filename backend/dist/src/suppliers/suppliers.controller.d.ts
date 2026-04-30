import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class SuppliersController {
    private suppliersService;
    private prisma;
    constructor(suppliersService: SuppliersService, prisma: PrismaService);
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
    findBySlug(slug: string): Promise<{
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
    verifySupplier(id: string, isVerified: boolean): Promise<{
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
    update(id: string, dto: UpdateSupplierDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
    addCertification(id: string, body: {
        name: string;
        issuedBy?: string;
        documentUrl?: string;
    }, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        id: string;
        supplierId: string;
        name: string;
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
