import { BatchesService } from './batches.service';
import { CreateBatchDto, GenerateQRCodesDto, VerifyQRDto } from './dto/batch.dto';
import type { Request } from 'express';
export declare class BatchesController {
    private batchesService;
    constructor(batchesService: BatchesService);
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
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        quantity: number;
        qrGenerated: boolean;
    })[]>;
    getSupplierQRCodes(supplierId: string): Promise<({
        batch: {
            product: {
                name: string;
                slug: string;
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
    createBatch(body: CreateBatchDto & {
        supplierId: string;
    }): Promise<{
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
    generateQRCodes(body: GenerateQRCodesDto & {
        supplierId: string;
    }): Promise<{
        message: string;
        codes: {
            code: `${string}-${string}-${string}-${string}-${string}`;
            token: string;
        }[];
    }>;
    verifyQR(dto: VerifyQRDto, req: Request): Promise<{
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
