import { CartService } from './cart.service';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<{
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
    addItem(req: any, body: {
        productId: string;
        quantity?: number;
    }): Promise<{
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
    updateItem(req: any, itemId: string, body: {
        quantity: number;
    }): Promise<{
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
    removeItem(req: any, itemId: string): Promise<{
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
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
