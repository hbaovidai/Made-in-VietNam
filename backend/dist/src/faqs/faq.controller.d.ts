import { FaqService } from './faq.service';
import { CreateFaqDto, UpdateFaqDto } from './faq.dto';
export declare class FaqController {
    private faqService;
    constructor(faqService: FaqService);
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
    create(dto: CreateFaqDto): Promise<{
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
    update(id: string, dto: UpdateFaqDto): Promise<{
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
