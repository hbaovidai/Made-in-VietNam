import { PrismaService } from '../prisma/prisma.service';
import { CreateRFQDto, CreateQuoteDto } from './dto/rfq.dto';
export declare class RfqService {
    private prisma;
    constructor(prisma: PrismaService);
    createRFQ(buyerId: string, dto: CreateRFQDto): Promise<{
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    }>;
    getBuyerRFQs(buyerId: string): Promise<({
        _count: {
            quotes: number;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    })[]>;
    submitQuote(supplierId: string, dto: CreateQuoteDto): Promise<{
        id: string;
        createdAt: Date;
        currency: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        supplierId: string;
        message: string | null;
        rfqId: string;
        price: number;
        leadTime: string;
    }>;
    getRFQDetails(id: string): Promise<{
        quotes: ({
            supplier: {
                companyName: string;
                logo: string | null;
                isVerified: boolean;
            };
        } & {
            id: string;
            createdAt: Date;
            currency: string;
            status: import("@prisma/client").$Enums.QuoteStatus;
            supplierId: string;
            message: string | null;
            rfqId: string;
            price: number;
            leadTime: string;
        })[];
        buyer: {
            email: string;
            fullName: string;
            phone: string | null;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    }>;
    getOpenRFQs(): Promise<({
        _count: {
            quotes: number;
        };
        buyer: {
            fullName: string;
        };
    } & {
        id: string;
        description: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    })[]>;
}
