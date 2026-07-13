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
        status: import("@prisma/client").$Enums.BatchStatus;
        createdAt: Date;
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
            status: import("@prisma/client").$Enums.BatchStatus;
            createdAt: Date;
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
        status: import("@prisma/client").$Enums.QRStatus;
        createdAt: Date;
        batchId: string;
        code: string;
        secretHash: string;
        scanCount: number;
        maxScans: number;
    })[]>;
    createBatch(supplierId: string, dto: CreateBatchDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.BatchStatus;
        createdAt: Date;
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
            status: import("@prisma/client").$Enums.ProductStatus;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            nameEn: string | null;
            supplierId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                nameEn: string | null;
                supplierId: string;
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
                status: import("@prisma/client").$Enums.SupplierStatus;
                companyName: string;
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
