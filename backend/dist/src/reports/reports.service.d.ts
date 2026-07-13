import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReports(): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        category: string | null;
        title: string;
        price: number;
        coverImage: string | null;
        pdfUrl: string | null;
    }[]>;
    getReportById(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        category: string | null;
        title: string;
        price: number;
        coverImage: string | null;
        pdfUrl: string | null;
    } | null>;
}
