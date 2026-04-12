import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
