import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, GenerateQRCodesDto } from './dto/batch.dto';
export declare class BatchesService {
    private prisma;
    private readonly QR_SECRET;
    constructor(prisma: PrismaService);
    getSupplierBatches(supplierId: string): Promise<({
        product: {
            name: string;
            slug: string;
        };
        _count: {
            qrCodes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.BatchStatus;
        supplierId: string;
        expiryDate: Date;
        quantity: number;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        qrGenerated: boolean;
    })[]>;
    createBatch(supplierId: string, dto: CreateBatchDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.BatchStatus;
        supplierId: string;
        expiryDate: Date;
        quantity: number;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        qrGenerated: boolean;
    }>;
    generateQRCodes(supplierId: string, dto: GenerateQRCodesDto): Promise<{
        message: string;
    }>;
    verifyQR(code: string, token: string, ipHash: string, userAgent?: string): Promise<{
        valid: boolean;
        warning: string;
        data: {
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProductStatus;
            updatedAt: Date;
            description: string | null;
            supplierId: string;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            images: string[];
            rating: number;
            reviewCount: number;
            viewCount: number;
            categoryId: string;
        };
    } | {
        valid: boolean;
        data: {
            product: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                status: import("@prisma/client").$Enums.ProductStatus;
                updatedAt: Date;
                description: string | null;
                supplierId: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                categoryId: string;
            };
            supplier: {
                companyName: string;
                isVerified: boolean;
            };
            batch: {
                batchNumber: string;
                mfgDate: Date;
                expDate: Date;
            };
            scanInfo: {
                scantCount: number;
                isFirstScan: boolean;
            };
        };
        warning?: undefined;
    }>;
}
