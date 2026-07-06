import { LegalService } from './legal.service';
import { CreateLegalSectionDto, UpdateLegalSectionDto } from './legal.dto';
export declare class LegalController {
    private readonly legalService;
    constructor(legalService: LegalService);
    findActive(pageKey?: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }[]>;
    findAll(pageKey?: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }>;
    create(dto: CreateLegalSectionDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }>;
    update(id: string, dto: UpdateLegalSectionDto): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }>;
    move(id: string, direction: 'up' | 'down'): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }[]>;
    delete(id: string): Promise<{
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        titleVi: string;
        titleEn: string;
        contentVi: string;
        contentEn: string;
        pageKey: string;
    }>;
}
