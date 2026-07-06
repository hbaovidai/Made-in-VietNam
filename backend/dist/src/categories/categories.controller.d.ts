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
    findBySlug(slug: string): Promise<{
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
