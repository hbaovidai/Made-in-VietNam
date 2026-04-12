import { InquiryBasketService } from './inquiry-basket.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';
export declare class InquiryBasketController {
    private inquiryBasketService;
    constructor(inquiryBasketService: InquiryBasketService);
    getBasket(userId: string, currentUserId: string): Promise<{
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
            productId: string;
            quantity: number;
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
    addItem(dto: AddInquiryItemDto, userId: string): Promise<{
        id: string;
        productId: string;
        quantity: number;
        note: string | null;
        basketId: string;
        addedAt: Date;
    }>;
    removeItem(itemId: string, userId: string): Promise<{
        message: string;
    }>;
}
