import { PrismaService } from '../prisma/prisma.service';
import { CreateRFQDto, CreateQuoteDto } from './dto/rfq.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class RfqService {
    private prisma;
    private notificationsService;
    private readonly MAX_QUOTES_PER_RFQ;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    createRFQ(buyerId: string, dto: CreateRFQDto): Promise<{
        category: string;
        id: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string | null;
        contactPhone: string | null;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        expiresAt: Date;
        buyerId: string;
    }>;
    getBuyerRFQs(buyerId: string): Promise<({
        _count: {
            quotes: number;
        };
    } & {
        category: string;
        id: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string | null;
        contactPhone: string | null;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        expiresAt: Date;
        buyerId: string;
    })[]>;
    submitQuote(supplierId: string, dto: CreateQuoteDto): Promise<{
        message: string | null;
        id: string;
        status: import("@prisma/client").$Enums.QuoteStatus;
        createdAt: Date;
        supplierId: string;
        currency: string;
        leadTime: string;
        rfqId: string;
        price: number;
    }>;
    getRFQDetails(id: string): Promise<{
        quotes: ({
            supplier: {
                id: string;
                status: import("@prisma/client").$Enums.SupplierStatus;
                userId: string;
                companyName: string;
                logo: string | null;
            };
        } & {
            message: string | null;
            id: string;
            status: import("@prisma/client").$Enums.QuoteStatus;
            createdAt: Date;
            supplierId: string;
            currency: string;
            leadTime: string;
            rfqId: string;
            price: number;
        })[];
        buyer: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
    } & {
        category: string;
        id: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string | null;
        contactPhone: string | null;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        expiresAt: Date;
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
        _count: {
            quotes: number;
        };
        buyer: {
            fullName: string;
        };
        category: string;
        id: string;
        status: import("@prisma/client").$Enums.RFQStatus;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string | null;
        contactPhone: string | null;
        description: string;
        quantity: number;
        productName: string;
        quantityUnit: string;
        budget: string | null;
        destination: string;
        contactName: string | null;
        expiresAt: Date;
        buyerId: string;
    }[]>;
}
