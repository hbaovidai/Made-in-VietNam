import { PrismaService } from '../prisma/prisma.service';
import { CreateLegalSectionDto, UpdateLegalSectionDto } from './legal.dto';
export declare class LegalService {
    private prisma;
    constructor(prisma: PrismaService);
    private checkAndSeed;
    findActive(pageKey?: string): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(pageKey?: string): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateLegalSectionDto): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateLegalSectionDto): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    move(id: string, direction: 'up' | 'down'): Promise<{
        id: string;
        pageKey: string;
        titleVi: string;
        titleEn: string;
        slug: string;
        contentVi: string;
        contentEn: string;
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
