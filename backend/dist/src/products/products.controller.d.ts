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
    findAllForAdmin(query: ProductQueryDto): Promise<{
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
    getMyProducts(userId: string): Promise<({
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
        supplierId: string;
        categoryId: string;
    })[]>;
    findBySlug(slug: string): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
    findRelated(id: string): Promise<({
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
        supplierId: string;
        categoryId: string;
    })[]>;
    create(dto: CreateProductDto, userId: string): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
    update(id: string, dto: UpdateProductDto, currentUser: {
        id: string;
        role: string;
    }): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
    delete(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
    verifyProduct(id: string, status: 'ACTIVE' | 'REJECTED'): Promise<{
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
        supplierId: string;
        categoryId: string;
    }>;
}
