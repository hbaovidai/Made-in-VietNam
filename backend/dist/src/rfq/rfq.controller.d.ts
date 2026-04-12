import { RfqService } from './rfq.service';
import { CreateRFQDto, CreateQuoteDto } from './dto/rfq.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class RfqController {
    private rfqService;
    private prisma;
    constructor(rfqService: RfqService, prisma: PrismaService);
    getOpenRFQs(currentUser: {
        id: string;
        role: string;
    }): Promise<({
        _count: {
            quotes: number;
        };
        buyer: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        updatedAt: Date;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    })[]>;
    getBuyerRFQs(buyerId: string, currentUser: {
        id: string;
        role: string;
    }): Promise<({
        _count: {
            quotes: number;
        };
    } & {
        id: string;
        createdAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        updatedAt: Date;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    })[]>;
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
            status: import("@prisma/client").$Enums.QuoteStatus;
            supplierId: string;
            currency: string;
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
        createdAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        updatedAt: Date;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    }>;
    createRFQ(dto: CreateRFQDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        category: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        updatedAt: Date;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactEmail: string | null;
        expiresAt: Date;
        buyerId: string;
    }>;
    submitQuote(dto: CreateQuoteDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import("@prisma/client").$Enums.QuoteStatus;
        supplierId: string;
        currency: string;
        message: string | null;
        rfqId: string;
        price: number;
        leadTime: string;
    }>;
}
