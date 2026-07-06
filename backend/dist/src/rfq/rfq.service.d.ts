import { PrismaService } from '../prisma/prisma.service';
import { CreateRFQDto, CreateQuoteDto } from './dto/rfq.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class RfqService {
    private prisma;
    private notificationsService;
    private readonly MAX_QUOTES_PER_RFQ;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createRFQ(buyerId: string, dto: CreateRFQDto): Promise<{
        id: string;
        productName: string;
        category: string;
        quantity: number;
        quantityUnit: string;
        description: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.RFQStatus;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
    }>;
    getBuyerRFQs(buyerId: string): Promise<({
        _count: {
            quotes: number;
        };
    } & {
        id: string;
        productName: string;
        category: string;
        quantity: number;
        quantityUnit: string;
        description: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.RFQStatus;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
    })[]>;
    submitQuote(supplierId: string, dto: CreateQuoteDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        createdAt: Date;
        price: number;
        currency: string;
        leadTime: string;
        message: string | null;
        rfqId: string;
        supplierId: string;
    }>;
    getRFQDetails(id: string): Promise<{
        quotes: ({
            supplier: {
                id: string;
                userId: string;
                companyName: string;
                logo: string | null;
                is_verified: boolean | null;
            };
        } & {
            id: string;
            status: import("@prisma/client").$Enums.QuoteStatus;
            createdAt: Date;
            price: number;
            currency: string;
            leadTime: string;
            message: string | null;
            rfqId: string;
            supplierId: string;
        })[];
        buyer: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
    } & {
        id: string;
        productName: string;
        category: string;
        quantity: number;
        quantityUnit: string;
        description: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.RFQStatus;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
    }>;
    acceptQuote(quoteId: string, buyerId: string): Promise<{
        message: string;
        supplierUserId: string;
    }>;
    getOpenRFQs(isVerified?: boolean): Promise<{
        id: string;
        productName: string;
        category: string;
        quantity: number;
        quantityUnit: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        expiresAt: Date;
        createdAt: Date;
        _count: {
            quotes: number;
        };
        description: null;
        budget: null;
        destination: null;
        contactEmail: null;
        contactName: null;
        contactPhone: null;
        buyer: {
            fullName: string;
        };
        _restricted: boolean;
    }[] | {
        _restricted: boolean;
        buyer: {
            fullName: string;
        };
        _count: {
            quotes: number;
        };
        id: string;
        productName: string;
        category: string;
        quantity: number;
        quantityUnit: string;
        description: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        status: import("@prisma/client").$Enums.RFQStatus;
        expiresAt: Date;
        createdAt: Date;
        updatedAt: Date;
        buyerId: string;
    }[]>;
}
