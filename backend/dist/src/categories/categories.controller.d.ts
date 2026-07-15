import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    } & {
        children: ({
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            nameEn: string | null;
            parentId: string | null;
        } & any)[];
    })[]>;
    getL1Categories(): Promise<{
        id: string;
        slug: string;
        name: string;
    }[]>;
    findBySlug(slug: string): Promise<{
        products: ({
            supplier: {
                slug: string;
                companyName: string;
                status: import("@prisma/client").$Enums.SupplierStatus;
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
        })[];
        _count: {
            products: number;
        };
        children: {
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            nameEn: string | null;
            parentId: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    findNameBySlug(slug: string): Promise<{
        name: string;
        nameEn: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
