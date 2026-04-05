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
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            companyName: string;
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
            isVerified: boolean;
            userId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        products: ({
            category: {
                name: string;
                slug: string;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            updatedAt: Date;
            description: string | null;
            supplierId: string;
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
            categoryId: string;
        })[];
        user: {
            email: string;
            fullName: string;
        };
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
        _count: {
            products: number;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
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
        isVerified: boolean;
        userId: string;
    }>;
    update(supplierId: string, dto: UpdateSupplierDto): Promise<{
        products: ({
            category: {
                name: string;
                slug: string;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            updatedAt: Date;
            description: string | null;
            supplierId: string;
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
            categoryId: string;
        })[];
        user: {
            email: string;
            fullName: string;
        };
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
        _count: {
            products: number;
        };
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        companyName: string;
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
        isVerified: boolean;
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
}
