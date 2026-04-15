import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ProductsController {
    private productsService;
    private prisma;
    constructor(productsService: ProductsService, prisma: PrismaService);
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
    findAllForAdmin(query: ProductQueryDto): Promise<{
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
    getMyProducts(userId: string): Promise<({
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
    findBySlug(slug: string): Promise<{
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
    findRelated(id: string): Promise<({
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
    create(dto: CreateProductDto, userId: string): Promise<{
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
    update(id: string, dto: UpdateProductDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
    delete(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
    verifyProduct(id: string, status: 'ACTIVE' | 'REJECTED'): Promise<{
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
