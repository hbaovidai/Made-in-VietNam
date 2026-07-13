import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReports(): Promise<{
        category: string | null;
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        price: number;
        coverImage: string | null;
        pdfUrl: string | null;
    }[]>;
    getReportById(id: string): Promise<{
        category: string | null;
        id: string;
        createdAt: Date;
        description: string | null;
        title: string;
        price: number;
        coverImage: string | null;
        pdfUrl: string | null;
    } | null>;
}
