import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            parentId: string | null;
        })[];
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        parentId: string | null;
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            parentId: string | null;
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
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        parentId: string | null;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        parentId: string | null;
    }>;
    update(id: string, dto: {
        name?: string;
        parentId?: string;
    }): Promise<{
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
