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
            parentId: string | null;
        })[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        products: ({
            supplier: {
                companyName: string;
                slug: string;
                isVerified: boolean;
            };
        } & {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        _count: {
            products: number;
        };
        children: {
            id: string;
            slug: string;
            createdAt: Date;
            name: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
        parentId: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        name: string;
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
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
