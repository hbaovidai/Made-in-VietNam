import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        children: {
            id: string;
            name: string;
            slug: string;
            parentId: string | null;
            createdAt: Date;
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    })[]>;
    findBySlug(slug: string): Promise<{
        children: {
            id: string;
            name: string;
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
            slug: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            description: string | null;
            updatedAt: Date;
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
        })[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
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
        slug: string;
        parentId: string | null;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
