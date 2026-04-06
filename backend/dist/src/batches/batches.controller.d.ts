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
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        id: string;
        supplierId: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        qrGenerated: boolean;
        createdAt: Date;
    })[]>;
    getSupplierQRCodes(supplierId: string): Promise<({
        batch: {
            product: {
                name: string;
                slug: string;
            };
        } & {
            productId: string;
            batchNumber: string;
            manufactureDate: Date;
            expiryDate: Date;
            quantity: number;
            id: string;
            supplierId: string;
            status: import("@prisma/client").$Enums.BatchStatus;
            qrGenerated: boolean;
            createdAt: Date;
        };
    } & {
        batchId: string;
        code: string;
        id: string;
        status: import("@prisma/client").$Enums.QRStatus;
        createdAt: Date;
        secretHash: string;
        scanCount: number;
        maxScans: number;
    })[]>;
    createBatch(body: CreateBatchDto & {
        supplierId: string;
    }): Promise<{
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        id: string;
        supplierId: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        qrGenerated: boolean;
        createdAt: Date;
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
            supplierId: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            name: string;
            slug: string;
            description: string | null;
            minPrice: number;
            maxPrice: number;
            currency: string;
            unit: string;
            moq: number;
            moqUnit: string;
            categoryId: string;
            images: string[];
            rating: number;
            reviewCount: number;
            viewCount: number;
            updatedAt: Date;
        };
    } | {
        valid: boolean;
        data: {
            product: {
                id: string;
                supplierId: string;
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                name: string;
                slug: string;
                description: string | null;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                categoryId: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                updatedAt: Date;
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
