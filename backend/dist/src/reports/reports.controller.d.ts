import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
