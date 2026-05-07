import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, GenerateQRCodesDto } from './dto/batch.dto';
export declare class BatchesService {
    private prisma;
    private readonly QR_SECRET;
    constructor(prisma: PrismaService);
    getSupplierBatches(supplierId: string): Promise<({
        _count: {
            qrCodes: number;
        };
        product: {
            slug: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.BatchStatus;
        supplierId: string;
        expiryDate: Date;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        quantity: number;
        qrGenerated: boolean;
    })[]>;
    getSupplierQRCodes(supplierId: string): Promise<({
        batch: {
            product: {
                slug: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.BatchStatus;
            supplierId: string;
            expiryDate: Date;
            productId: string;
            batchNumber: string;
            manufactureDate: Date;
            quantity: number;
            qrGenerated: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.QRStatus;
        batchId: string;
        code: string;
        secretHash: string;
        scanCount: number;
        maxScans: number;
    })[]>;
    createBatch(supplierId: string, dto: CreateBatchDto): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.BatchStatus;
        supplierId: string;
        expiryDate: Date;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        quantity: number;
        qrGenerated: boolean;
    }>;
    generateQRCodes(supplierId: string, dto: GenerateQRCodesDto): Promise<{
        message: string;
        codes: {
            code: `${string}-${string}-${string}-${string}-${string}`;
            token: string;
        }[];
    }>;
    verifyQR(code: string, token?: string, ipHash?: string, userAgent?: string): Promise<{
        valid: boolean;
        warning: string;
        data: {
            id: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            images: string[];
            status: import("@prisma/client").$Enums.ProductStatus;
            rating: number;
            reviewCount: number;
            viewCount: number;
            rfqMinQuantity: number | null;
            supplierId: string;
            categoryId: string;
        };
    } | {
        valid: boolean;
        data: {
            product: {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                status: import("@prisma/client").$Enums.ProductStatus;
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                supplierId: string;
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
