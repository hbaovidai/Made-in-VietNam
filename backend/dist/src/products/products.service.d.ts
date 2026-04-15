import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ProductsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    findAll(query: ProductQueryDto): Promise<{
        data: ({
            supplier: {
                id: string;
                slug: string;
                companyName: string;
                logo: string | null;
                isVerified: boolean;
            };
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            supplierId: string;
            name: string;
            slug: string;
            description: string | null;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            categoryId: string;
            images: string[];
            status: import("@prisma/client").$Enums.ProductStatus;
            rating: number;
            reviewCount: number;
            viewCount: number;
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
    findByIdOrSlug(idOrSlug: string): Promise<{
        supplier: {
            id: string;
            slug: string;
            description: string | null;
            companyName: string;
            logo: string | null;
            city: string | null;
            province: string | null;
            isVerified: boolean;
            industries: {
                industry: string;
            }[];
            markets: {
                market: string;
            }[];
        };
        category: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAllForSupplier(supplierId: string): Promise<({
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(supplierId: string, dto: CreateProductDto): Promise<{
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(productId: string, supplierId: string | null, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(productId: string, supplierId: string | null): Promise<{
        message: string;
    }>;
    findRelated(productId: string, limit?: number): Promise<({
        supplier: {
            slug: string;
            companyName: string;
        };
    } & {
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    verifyProduct(productId: string, status: 'ACTIVE' | 'REJECTED'): Promise<{
        id: string;
        supplierId: string;
        name: string;
        slug: string;
        description: string | null;
        minPrice: number;
        maxPrice: number;
        currency: string;
        unit: string;
        moq: number;
        moqUnit: string;
        categoryId: string;
        images: string[];
        status: import("@prisma/client").$Enums.ProductStatus;
        rating: number;
        reviewCount: number;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
