import { BatchesService } from './batches.service';
import { CreateBatchDto, GenerateQRCodesDto, VerifyQRDto } from './dto/batch.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';
export declare class BatchesController {
    private batchesService;
    private prisma;
    constructor(batchesService: BatchesService, prisma: PrismaService);
    getSupplierBatches(supplierId: string, userId: string): Promise<({
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
    getSupplierQRCodes(supplierId: string, userId: string): Promise<({
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
    createBatch(dto: CreateBatchDto, userId: string): Promise<{
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
    generateQRCodes(dto: GenerateQRCodesDto, userId: string): Promise<{
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
