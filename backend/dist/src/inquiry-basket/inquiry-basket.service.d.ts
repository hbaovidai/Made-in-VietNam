import { PrismaService } from '../prisma/prisma.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';
export declare class InquiryBasketService {
    private prisma;
    constructor(prisma: PrismaService);
    getBasket(userId: string): Promise<{
        items: ({
            product: {
                supplier: {
                    companyName: string;
                };
                id: string;
                slug: string;
                name: string;
                minPrice: number;
                maxPrice: number;
                unit: string;
                images: string[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            basketId: string;
            note: string | null;
            addedAt: Date;
        })[];
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItem(userId: string, dto: AddInquiryItemDto): Promise<{
        id: string;
        productId: string;
        quantity: number;
        basketId: string;
        note: string | null;
        addedAt: Date;
    }>;
    removeItem(itemId: string, userId: string): Promise<{
        message: string;
    }>;
}
