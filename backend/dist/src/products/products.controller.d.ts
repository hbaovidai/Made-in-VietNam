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
                status: import("@prisma/client").$Enums.SupplierStatus;
            };
            category: {
                id: string;
                slug: string;
                name: string;
            };
            priceTiers: {
                id: string;
                minQty: number;
                productId: string;
                maxQty: number | null;
                price: number;
            }[];
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
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
                status: import("@prisma/client").$Enums.SupplierStatus;
            };
            category: {
                id: string;
                slug: string;
                name: string;
            };
            priceTiers: {
                id: string;
                minQty: number;
                productId: string;
                maxQty: number | null;
                price: number;
            }[];
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    })[]>;
    findBySlug(slug: string): Promise<{
        supplier: {
            id: string;
            slug: string;
            companyName: string;
            logo: string | null;
            description: string | null;
            status: import("@prisma/client").$Enums.SupplierStatus;
            addresses: {
                isPrimary: boolean;
                address: string;
            }[];
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
        priceTiers: {
            id: string;
            minQty: number;
            productId: string;
            maxQty: number | null;
            price: number;
        }[];
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    }>;
    findRelated(id: string): Promise<({
        supplier: {
            slug: string;
            companyName: string;
        };
    } & {
        id: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        status: import("@prisma/client").$Enums.ProductStatus;
        name: string;
        nameEn: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    }>;
}
