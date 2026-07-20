import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, body: {
        productId: string;
        rating: number;
        content: string;
        images?: string[];
    }): Promise<{
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    }>;
    getProductReviews(productId: string): Promise<{
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    }[]>;
    findAll(): Promise<({
        product: {
            name: string;
        };
    } & {
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    })[]>;
    updateStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
    incrementHelpful(id: string): Promise<{
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    }>;
    addSellerReply(id: string, body: {
        reply: string;
    }): Promise<{
        id: string;
        userId: string | null;
        createdAt: Date;
        status: string;
        images: string[];
        rating: number;
        productId: string;
        content: string;
        verifiedPurchase: boolean;
        helpfulCount: number;
        sellerReply: string | null;
        sellerRepliedAt: Date | null;
        authorName: string;
        authorEmail: string;
    }>;
}
