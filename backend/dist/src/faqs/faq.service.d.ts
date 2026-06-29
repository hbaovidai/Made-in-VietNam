import { PrismaService } from '../prisma/prisma.service';
export declare class FaqService {
    private prisma;
    constructor(prisma: PrismaService);
    findActive(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
    }[]>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
    }[]>;
    create(data: {
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
    }>;
    update(id: string, data: {
        questionVi?: string;
        answerVi?: string;
        questionEn?: string;
        answerEn?: string;
        sortOrder?: number;
        isActive?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        sortOrder: number;
        isActive: boolean;
        questionVi: string;
        answerVi: string;
        questionEn: string;
        answerEn: string;
    }>;
}
