import { InquiryBasketService } from './inquiry-basket.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';
export declare class InquiryBasketController {
    private inquiryBasketService;
    constructor(inquiryBasketService: InquiryBasketService);
    getBasket(userId: string, currentUserId: string): Promise<{
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
    addItem(dto: AddInquiryItemDto, userId: string): Promise<{
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
