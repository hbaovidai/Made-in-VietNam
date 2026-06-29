import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        id: string;
        createdAt: Date;
        slug: string;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    } & {
        children: ({
            id: string;
            createdAt: Date;
            slug: string;
            name: string;
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
                companyName: string;
                slug: string;
                isVerified: boolean | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            name: string;
            nameEn: string | null;
            descriptionEn: string | null;
            supplierId: string;
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
            origin: string | null;
            leadTime: string | null;
            brand: string | null;
            sku: string | null;
            productionCapacity: string | null;
            port: string | null;
            exportMarkets: string | null;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            customizations: string[];
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        children: {
            id: string;
            createdAt: Date;
            slug: string;
            name: string;
            nameEn: string | null;
            parentId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        slug: string;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        slug: string;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
