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
                status: import("@prisma/client").$Enums.SupplierStatus;
                slug: string;
                companyName: string;
                logo: string | null;
            };
            priceTiers: {
                id: string;
                minQty: number;
                productId: string;
                maxQty: number | null;
                price: number;
            }[];
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            updatedAt: Date;
            supplierId: string;
            nameEn: string | null;
            slug: string;
            description: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
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
                status: import("@prisma/client").$Enums.SupplierStatus;
                slug: string;
                companyName: string;
                logo: string | null;
            };
            priceTiers: {
                id: string;
                minQty: number;
                productId: string;
                maxQty: number | null;
                price: number;
            }[];
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            updatedAt: Date;
            supplierId: string;
            nameEn: string | null;
            slug: string;
            description: string | null;
            descriptionEn: string | null;
            pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    })[]>;
    findBySlug(slug: string): Promise<{
        supplier: {
            id: string;
            status: import("@prisma/client").$Enums.SupplierStatus;
            slug: string;
            description: string | null;
            companyName: string;
            logo: string | null;
            addresses: {
                isPrimary: boolean;
                address: string;
            }[];
            certifications: {
                id: string;
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
        };
        priceTiers: {
            id: string;
            minQty: number;
            productId: string;
            maxQty: number | null;
            price: number;
        }[];
        category: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    }>;
    findRelated(id: string): Promise<({
        supplier: {
            slug: string;
            companyName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    })[]>;
    create(dto: CreateProductDto, userId: string): Promise<{
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    }>;
    delete(id: string, currentUser: {
        id: string;
        role: string;
    }): Promise<{
        message: string;
    }>;
    verifyProduct(id: string, status: 'ACTIVE' | 'REJECTED', reason?: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        status: import("@prisma/client").$Enums.ProductStatus;
        updatedAt: Date;
        supplierId: string;
        nameEn: string | null;
        slug: string;
        description: string | null;
        descriptionEn: string | null;
        pricingMode: import("@prisma/client").$Enums.PricingMode;
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
    }>;
}
