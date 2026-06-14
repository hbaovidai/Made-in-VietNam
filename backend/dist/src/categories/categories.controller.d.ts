import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        _count: {
            products: number;
            children: number;
        };
        children: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            nameEn: string | null;
            parentId: string | null;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        nameEn: string | null;
        parentId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        products: ({
            supplier: {
                companyName: string;
                slug: string;
                isVerified: boolean | null;
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
