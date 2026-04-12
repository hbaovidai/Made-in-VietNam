import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: ProductQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            supplier: {
                id: string;
                slug: string;
                companyName: string;
                logo: string | null;
                isVerified: boolean;
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
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findByIdOrSlug(idOrSlug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        supplier: {
            id: string;
            slug: string;
            companyName: string;
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
    }>;
    create(supplierId: string, dto: CreateProductDto): Promise<{
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
    }>;
    update(productId: string, supplierId: string, dto: UpdateProductDto): Promise<{
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
    }>;
    delete(productId: string, supplierId: string): Promise<{
        message: string;
    }>;
    findRelated(productId: string, limit?: number): Promise<({
        supplier: {
            slug: string;
            companyName: string;
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
    })[]>;
}
