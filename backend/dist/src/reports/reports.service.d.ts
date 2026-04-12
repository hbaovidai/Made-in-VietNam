import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReports(): Promise<{
        id: string;
        createdAt: Date;
        category: string | null;
        description: string | null;
        price: number;
        title: string;
        coverImage: string | null;
        pdfUrl: string | null;
    }[]>;
    getReportById(id: string): Promise<{
        id: string;
        createdAt: Date;
        category: string | null;
        description: string | null;
        price: number;
        title: string;
        coverImage: string | null;
        pdfUrl: string | null;
    } | null>;
}
