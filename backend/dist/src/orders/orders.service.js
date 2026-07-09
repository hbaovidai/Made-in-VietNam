"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cart_service_1 = require("../cart/cart.service");
let OrdersService = class OrdersService {
    prisma;
    cartService;
    constructor(prisma, cartService) {
        this.prisma = prisma;
        this.cartService = cartService;
    }
    generateOrderNumber() {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 9000 + 1000);
        return `MIVN-${dateStr}-${random}`;
    }
    async createOrder(userId, data) {
        const cart = await this.cartService.getCart(userId);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Giỏ hàng trống');
        }
        const groupedBySupplier = {};
        for (const item of cart.items) {
            const supplierId = item.product.supplierId;
            if (!groupedBySupplier[supplierId]) {
                groupedBySupplier[supplierId] = [];
            }
            groupedBySupplier[supplierId].push(item);
        }
        const orders = [];
        const shippingFee = 30000;
        for (const [supplierId, items] of Object.entries(groupedBySupplier)) {
            const subtotal = items.reduce((sum, item) => {
                return sum + item.product.minPrice * item.quantity;
            }, 0);
            const order = await this.prisma.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    buyerId: userId,
                    supplierId,
                    recipientName: data.recipientName,
                    recipientPhone: data.recipientPhone,
                    shippingAddress: data.shippingAddress,
                    note: data.note || null,
                    paymentMethod: data.paymentMethod || 'COD',
                    subtotal,
                    shippingFee,
                    totalAmount: subtotal + shippingFee,
                    items: {
                        create: items.map((item) => ({
                            productId: item.product.id,
                            productName: item.product.name,
                            productImage: item.product.images?.[0] || null,
                            unitPrice: item.product.minPrice,
                            quantity: item.quantity,
                            totalPrice: item.product.minPrice * item.quantity,
                        })),
                    },
                },
                include: {
                    items: true,
                    supplier: { select: { id: true, companyName: true } },
                },
            });
            orders.push(order);
        }
        await this.cartService.clearCart(userId);
        return {
            message: `Đặt hàng thành công! Đã tạo ${orders.length} đơn hàng.`,
            orders,
        };
    }
    async getBuyerOrders(userId) {
        return this.prisma.order.findMany({
            where: { buyerId: userId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, slug: true, images: true } },
                    },
                },
                supplier: { select: { id: true, companyName: true, logo: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getSupplierOrders(userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier) {
            throw new common_1.NotFoundException('Không tìm thấy nhà cung cấp');
        }
        return this.prisma.order.findMany({
            where: { supplierId: supplier.id },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, slug: true, images: true } },
                    },
                },
                buyer: {
                    select: { id: true, fullName: true, email: true, phone: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getOrderDetail(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: { select: { id: true, slug: true, images: true } },
                    },
                },
                supplier: {
                    select: {
                        id: true,
                        companyName: true,
                        logo: true,
                        contactPhone: true,
                    },
                },
                buyer: {
                    select: { id: true, fullName: true, email: true, phone: true },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (order.buyerId !== userId && supplier?.id !== order.supplierId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem đơn hàng này');
        }
        return order;
    }
    async updateOrderStatus(userId, orderId, status) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier) {
            throw new common_1.ForbiddenException('Chỉ nhà cung cấp mới có thể cập nhật trạng thái');
        }
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order || order.supplierId !== supplier.id) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        const updateData = { status };
        if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
            updateData.paymentStatus = 'PAID';
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                items: true,
                buyer: { select: { id: true, fullName: true, email: true } },
            },
        });
    }
    async cancelOrder(userId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order || order.buyerId !== userId) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        if (order.status !== 'PENDING') {
            throw new common_1.BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xác nhận');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
        });
    }
    async getAllOrders(query) {
        const page = Number(query.page) || 1;
        const limit = Math.min(Number(query.limit) || 50, 100);
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status && query.status !== 'ALL') {
            where.status = query.status;
        }
        const [data, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: { select: { id: true, slug: true, images: true } },
                        },
                    },
                    buyer: {
                        select: { id: true, fullName: true, email: true, phone: true },
                    },
                    supplier: { select: { id: true, companyName: true, logo: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async adminUpdateOrderStatus(orderId, status) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
        });
        if (!order)
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        const updateData = { status };
        if (status === 'DELIVERED' && order.paymentMethod === 'COD') {
            updateData.paymentStatus = 'PAID';
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                items: true,
                buyer: { select: { id: true, fullName: true, email: true } },
                supplier: { select: { id: true, companyName: true } },
            },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map