import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
