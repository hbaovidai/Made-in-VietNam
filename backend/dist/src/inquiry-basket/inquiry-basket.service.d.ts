import { PrismaService } from '../prisma/prisma.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';
export declare class InquiryBasketService {
    private prisma;
    constructor(prisma: PrismaService);
    getBasket(userId: string): Promise<{
        items: ({
            product: {
                id: string;
                name: string;
                slug: string;
                supplier: {
                    companyName: string;
                };
                minPrice: number;
                maxPrice: number;
                unit: string;
                images: string[];
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            note: string | null;
            basketId: string;
            addedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
    }>;
    addItem(userId: string, dto: AddInquiryItemDto): Promise<{
        id: string;
        quantity: number;
        productId: string;
        note: string | null;
        basketId: string;
        addedAt: Date;
    }>;
    removeItem(itemId: string, userId: string): Promise<{
        message: string;
    }>;
}
