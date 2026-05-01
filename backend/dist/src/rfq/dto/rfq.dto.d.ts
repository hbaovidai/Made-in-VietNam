import { RFQStatus, QuoteStatus } from '@prisma/client';
export declare class CreateRFQDto {
    productName: string;
    category: string;
    quantity: number;
    quantityUnit: string;
    description: string;
    budget?: string;
    destination: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    expiresAt: string;
}
export declare class CreateQuoteDto {
    rfqId: string;
    price: number;
    currency?: string;
    leadTime: string;
    message?: string;
}
export declare class UpdateRFQStatusDto {
    status: RFQStatus;
}
export declare class UpdateQuoteStatusDto {
    status: QuoteStatus;
}
