import { BatchesService } from './batches.service';
import { CreateBatchDto, GenerateQRCodesDto, VerifyQRDto } from './dto/batch.dto';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';
export declare class BatchesController {
    private batchesService;
    private prisma;
    constructor(batchesService: BatchesService, prisma: PrismaService);
    getSupplierBatches(supplierId: string, userId: string): Promise<({
        product: {
            name: string;
            slug: string;
        };
        _count: {
            qrCodes: number;
        };
    } & {
        id: string;
        supplierId: string;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import("@prisma/client").$Enums.BatchStatus;
        qrGenerated: boolean;
        createdAt: Date;
    })[]>;
    getSupplierQRCodes(supplierId: string, userId: string): Promise<({
        batch: {
            product: {
                name: string;
                slug: string;
            };
        } & {
            id: string;
            supplierId: string;
            productId: string;
            batchNumber: string;
            manufactureDate: Date;
            expiryDate: Date;
            quantity: number;
            status: import("@prisma/client").$Enums.BatchStatus;
            qrGenerated: boolean;
            createdAt: Date;
        };
    } & {
        id: string;
        status: import("@prisma/client").$Enums.QRStatus;
        createdAt: Date;
        batchId: string;
        code: string;
        secretHash: string;
        scanCount: number;
        maxScans: number;
    })[]>;
    createBatch(dto: CreateBatchDto, userId: string): Promise<{
        id: string;
        supplierId: string;
        productId: string;
        batchNumber: string;
        manufactureDate: Date;
        expiryDate: Date;
        quantity: number;
        status: import("@prisma/client").$Enums.BatchStatus;
        qrGenerated: boolean;
        createdAt: Date;
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
            supplierId: string;
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            name: string;
            nameEn: string | null;
            slug: string;
            description: string | null;
            descriptionEn: string | null;
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
            rfqMinQuantity: number | null;
            updatedAt: Date;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            brand: string | null;
            customizations: string[];
            exportMarkets: string | null;
            leadTime: string | null;
            origin: string | null;
            port: string | null;
            productionCapacity: string | null;
            sku: string | null;
            specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
                nameEn: string | null;
                slug: string;
                description: string | null;
                descriptionEn: string | null;
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
                rfqMinQuantity: number | null;
                updatedAt: Date;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                brand: string | null;
                customizations: string[];
                exportMarkets: string | null;
                leadTime: string | null;
                origin: string | null;
                port: string | null;
                productionCapacity: string | null;
                sku: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
            };
            supplier: {
                companyName: string;
                is_verified: boolean | null;
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
