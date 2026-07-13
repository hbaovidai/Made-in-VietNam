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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                nameEn: string | null;
                supplierId: string;
                descriptionEn: string | null;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                categoryId: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                brand: string | null;
                customizations: string[];
                exportMarkets: string | null;
                leadTime: string | null;
                origin: string | null;
                port: string | null;
                productionCapacity: string | null;
                sku: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        updatedAt: Date;
        userId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                nameEn: string | null;
                supplierId: string;
                descriptionEn: string | null;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                categoryId: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                brand: string | null;
                customizations: string[];
                exportMarkets: string | null;
                leadTime: string | null;
                origin: string | null;
                port: string | null;
                productionCapacity: string | null;
                sku: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        updatedAt: Date;
        userId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                nameEn: string | null;
                supplierId: string;
                descriptionEn: string | null;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                categoryId: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                brand: string | null;
                customizations: string[];
                exportMarkets: string | null;
                leadTime: string | null;
                origin: string | null;
                port: string | null;
                productionCapacity: string | null;
                sku: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        updatedAt: Date;
        userId: string;
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
                status: import("@prisma/client").$Enums.ProductStatus;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                description: string | null;
                nameEn: string | null;
                supplierId: string;
                descriptionEn: string | null;
                minPrice: number;
                maxPrice: number;
                currency: string;
                unit: string;
                moq: number;
                moqUnit: string;
                categoryId: string;
                images: string[];
                rating: number;
                reviewCount: number;
                viewCount: number;
                rfqMinQuantity: number | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                brand: string | null;
                customizations: string[];
                exportMarkets: string | null;
                leadTime: string | null;
                origin: string | null;
                port: string | null;
                productionCapacity: string | null;
                sku: string | null;
                specifications: import("@prisma/client/runtime/library").JsonValue | null;
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
        updatedAt: Date;
        userId: string;
    }>;
    clearCart(req: any): Promise<{
        message: string;
    }>;
}
