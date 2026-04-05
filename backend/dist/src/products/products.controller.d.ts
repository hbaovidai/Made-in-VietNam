import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
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
    findBySlug(slug: string): Promise<{
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
    findRelated(id: string): Promise<({
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
    create(body: CreateProductDto & {
        supplierId: string;
    }): Promise<{
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
    update(id: string, body: UpdateProductDto & {
        supplierId: string;
    }): Promise<{
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
    delete(id: string, supplierId: string): Promise<{
        message: string;
    }>;
}
