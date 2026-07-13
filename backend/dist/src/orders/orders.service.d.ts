import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
export declare class OrdersService {
    private prisma;
    private cartService;
    constructor(prisma: PrismaService, cartService: CartService);
    private generateOrderNumber;
    createOrder(userId: string, data: {
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note?: string;
        paymentMethod?: 'COD' | 'BANK_TRANSFER';
    }): Promise<{
        message: string;
        orders: ({
            supplier: {
                id: string;
                companyName: string;
            };
            items: {
                id: string;
                productId: string;
                quantity: number;
                productName: string;
                productImage: string | null;
                unitPrice: number;
                totalPrice: number;
                orderId: string;
            }[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            supplierId: string;
            buyerId: string;
            orderNumber: string;
            recipientName: string;
            recipientPhone: string;
            shippingAddress: string;
            note: string | null;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            subtotal: number;
            shippingFee: number;
            totalAmount: number;
        })[];
    }>;
    getBuyerOrders(userId: string): Promise<({
        supplier: {
            id: string;
            companyName: string;
            logo: string | null;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    })[]>;
    getSupplierOrders(userId: string): Promise<({
        buyer: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    })[]>;
    getOrderDetail(userId: string, orderId: string): Promise<{
        supplier: {
            id: string;
            contactPhone: string | null;
            companyName: string;
            logo: string | null;
        };
        buyer: {
            id: string;
            email: string;
            fullName: string;
            phone: string | null;
        };
        items: ({
            product: {
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            productId: string;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    }>;
    updateOrderStatus(userId: string, orderId: string, status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED'): Promise<{
        buyer: {
            id: string;
            email: string;
            fullName: string;
        };
        items: {
            id: string;
            productId: string;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    }>;
    cancelOrder(userId: string, orderId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    }>;
    getAllOrders(query: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
        data: ({
            supplier: {
                id: string;
                companyName: string;
                logo: string | null;
            };
            buyer: {
                id: string;
                email: string;
                fullName: string;
                phone: string | null;
            };
            items: ({
                product: {
                    id: string;
                    slug: string;
                    images: string[];
                };
            } & {
                id: string;
                productId: string;
                quantity: number;
                productName: string;
                productImage: string | null;
                unitPrice: number;
                totalPrice: number;
                orderId: string;
            })[];
        } & {
            id: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            createdAt: Date;
            updatedAt: Date;
            supplierId: string;
            buyerId: string;
            orderNumber: string;
            recipientName: string;
            recipientPhone: string;
            shippingAddress: string;
            note: string | null;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
            subtotal: number;
            shippingFee: number;
            totalAmount: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    adminUpdateOrderStatus(orderId: string, status: string): Promise<{
        supplier: {
            id: string;
            companyName: string;
        };
        buyer: {
            id: string;
            email: string;
            fullName: string;
        };
        items: {
            id: string;
            productId: string;
            quantity: number;
            productName: string;
            productImage: string | null;
            unitPrice: number;
            totalPrice: number;
            orderId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        supplierId: string;
        buyerId: string;
        orderNumber: string;
        recipientName: string;
        recipientPhone: string;
        shippingAddress: string;
        note: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        paymentStatus: import("@prisma/client").$Enums.PaymentStatus;
        subtotal: number;
        shippingFee: number;
        totalAmount: number;
    }>;
}
