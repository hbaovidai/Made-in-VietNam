import { PrismaService } from '../prisma/prisma.service';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    getCart(userId: string): Promise<{
        items: ({
            product: {
                supplier: {
                    id: string;
                    companyName: string;
                    logo: string | null;
                };
            } & {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                status: import("@prisma/client").$Enums.ProductStatus;
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                supplierId: string;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
    }>;
    addItem(userId: string, productId: string, quantity: number): Promise<{
        items: ({
            product: {
                supplier: {
                    id: string;
                    companyName: string;
                    logo: string | null;
                };
            } & {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                status: import("@prisma/client").$Enums.ProductStatus;
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                supplierId: string;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
    }>;
    updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<{
        items: ({
            product: {
                supplier: {
                    id: string;
                    companyName: string;
                    logo: string | null;
                };
            } & {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                status: import("@prisma/client").$Enums.ProductStatus;
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                supplierId: string;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
    }>;
    removeItem(userId: string, itemId: string): Promise<{
        items: ({
            product: {
                supplier: {
                    id: string;
                    companyName: string;
                    logo: string | null;
                };
            } & {
                id: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                images: string[];
                status: import("@prisma/client").$Enums.ProductStatus;
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                supplierId: string;
                categoryId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[];
    } & {
        id: string;
        userId: string;
        updatedAt: Date;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
}
