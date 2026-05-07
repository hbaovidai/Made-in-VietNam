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
                companyName: string;
                slug: string;
                logo: string | null;
                isVerified: boolean;
            };
            category: {
                id: string;
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
            supplierId: string;
            categoryId: string;
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
            companyName: string;
            slug: string;
            logo: string | null;
            description: string | null;
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
        supplierId: string;
        categoryId: string;
    }>;
    findAllForSupplier(supplierId: string): Promise<({
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
        supplierId: string;
        categoryId: string;
    })[]>;
    create(supplierId: string, dto: CreateProductDto): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
    update(productId: string, supplierId: string | null, dto: UpdateProductDto): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
    delete(productId: string, supplierId: string | null): Promise<{
        message: string;
    }>;
    findRelated(productId: string, limit?: number): Promise<({
        supplier: {
            companyName: string;
            slug: string;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        supplierId: string;
        categoryId: string;
    })[]>;
    verifyProduct(productId: string, status: 'ACTIVE' | 'REJECTED'): Promise<{
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
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
        supplierId: string;
        categoryId: string;
    }>;
}
