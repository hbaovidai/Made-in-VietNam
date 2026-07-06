import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        name: string;
        id: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    } & {
        children: ({
            name: string;
            id: string;
            nameEn: string | null;
            slug: string;
            parentId: string | null;
            createdAt: Date;
        } & any)[];
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
            name: string;
            id: string;
            nameEn: string | null;
            slug: string;
            parentId: string | null;
            createdAt: Date;
        }[];
        products: ({
            supplier: {
                slug: string;
                companyName: string;
                is_verified: boolean | null;
            };
        } & {
            name: string;
            id: string;
            nameEn: string | null;
            slug: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            description: string | null;
            updatedAt: Date;
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
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        name: string;
        id: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        name: string;
        id: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
