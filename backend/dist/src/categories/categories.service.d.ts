import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { TranslationService } from '../translation/translation.service';
export declare class CategoriesService {
    private prisma;
    private translationService;
    constructor(prisma: PrismaService, translationService: TranslationService);
    findAll(): Promise<({
        children: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            name: string;
            nameEn: string | null;
            slug: string;
            parentId: string | null;
            createdAt: Date;
        })[];
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
            id: string;
            name: string;
            nameEn: string | null;
            slug: string;
            parentId: string | null;
            createdAt: Date;
        }[];
        products: ({
            supplier: {
                slug: string;
                companyName: string;
                isVerified: boolean;
            };
        } & {
            id: string;
            name: string;
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
        })[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        name: string;
        nameEn: string | null;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
