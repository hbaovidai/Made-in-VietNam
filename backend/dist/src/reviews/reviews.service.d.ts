import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, body: {
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
    updateStatus(id: string, status: string): Promise<{
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
    addSellerReply(id: string, reply: string): Promise<{
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
    private recalculateProductRating;
}
