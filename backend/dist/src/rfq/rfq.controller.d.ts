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
    getBuyerRFQs(buyerId: string, currentUser: {
        id: string;
        role: string;
    }): Promise<({
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
    createRFQ(dto: CreateRFQDto, userId: string): Promise<{
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
    submitQuote(dto: CreateQuoteDto, userId: string): Promise<{
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
}
