import { OrdersService } from './orders.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class OrdersController {
    private ordersService;
    private auditLogService;
    constructor(ordersService: OrdersService, auditLogService: AuditLogService);
    getAllOrders(query: any): Promise<{
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
    adminUpdateStatus(req: any, id: string, body: {
        status: string;
    }): Promise<{
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
    createOrder(req: any, body: {
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
    getBuyerOrders(req: any): Promise<({
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
    getSupplierOrders(req: any): Promise<({
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
    getOrderDetail(req: any, id: string): Promise<{
        supplier: {
            id: string;
            companyName: string;
            logo: string | null;
            companyPhone: string | null;
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
    updateStatus(req: any, id: string, body: {
        status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED';
    }): Promise<{
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
    cancelOrder(req: any, id: string): Promise<{
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
