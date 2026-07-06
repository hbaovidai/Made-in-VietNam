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
        data: any;
    } | {
        valid: boolean;
        data: {
            product: any;
            supplier: any;
            batch: {
                batchNumber: any;
                mfgDate: any;
                expDate: any;
            };
            scanInfo: {
                scantCount: number;
                isFirstScan: boolean;
            };
        };
        warning?: undefined;
    }>;
}
