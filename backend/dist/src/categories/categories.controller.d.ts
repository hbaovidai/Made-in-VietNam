import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        nameEn: string | null;
        parentId: string | null;
    } & {
        children: ({
            id: string;
            createdAt: Date;
            name: string;
            slug: string;
            nameEn: string | null;
            parentId: string | null;
        } & any)[];
    })[]>;
    findBySlug(slug: string): Promise<{
        _count: {
            products: number;
        };
        products: ({
            supplier: {
                status: import("@prisma/client").$Enums.SupplierStatus;
                slug: string;
                companyName: string;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            nameEn: string | null;
            supplierId: string;
            descriptionEn: string | null;
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
        children: {
            id: string;
            createdAt: Date;
            name: string;
            slug: string;
            nameEn: string | null;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
