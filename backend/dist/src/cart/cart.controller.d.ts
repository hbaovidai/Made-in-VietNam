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
                slug: string;
                description: string | null;
                name: string;
                nameEn: string | null;
                descriptionEn: string | null;
                supplierId: string;
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
                origin: string | null;
                leadTime: string | null;
                brand: string | null;
                sku: string | null;
                productionCapacity: string | null;
                port: string | null;
                exportMarkets: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                customizations: string[];
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
                slug: string;
                description: string | null;
                name: string;
                nameEn: string | null;
                descriptionEn: string | null;
                supplierId: string;
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
                origin: string | null;
                leadTime: string | null;
                brand: string | null;
                sku: string | null;
                productionCapacity: string | null;
                port: string | null;
                exportMarkets: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                customizations: string[];
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
                slug: string;
                description: string | null;
                name: string;
                nameEn: string | null;
                descriptionEn: string | null;
                supplierId: string;
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
                origin: string | null;
                leadTime: string | null;
                brand: string | null;
                sku: string | null;
                productionCapacity: string | null;
                port: string | null;
                exportMarkets: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                customizations: string[];
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
                slug: string;
                description: string | null;
                name: string;
                nameEn: string | null;
                descriptionEn: string | null;
                supplierId: string;
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
                origin: string | null;
                leadTime: string | null;
                brand: string | null;
                sku: string | null;
                productionCapacity: string | null;
                port: string | null;
                exportMarkets: string | null;
                attributes: import("@prisma/client/runtime/library").JsonValue | null;
                customizations: string[];
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
