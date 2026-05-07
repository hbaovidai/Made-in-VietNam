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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                supplier: { select: { id: true, companyName: true, logo: true } },
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    supplier: { select: { id: true, companyName: true, logo: true } },
                                },
                            },
                        },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
        }
        return cart;
    }
    async getCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        return cart;
    }
    async addItem(userId, productId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });
        if (existingItem) {
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }
        else {
            await this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                },
            });
        }
        return this.getCart(userId);
    }
    async updateItemQuantity(userId, itemId, quantity) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
        });
        if (!item) {
            throw new Error('Sản phẩm không có trong giỏ hàng');
        }
        if (quantity <= 0) {
            await this.prisma.cartItem.delete({ where: { id: itemId } });
        }
        else {
            await this.prisma.cartItem.update({
                where: { id: itemId },
                data: { quantity },
            });
        }
        return this.getCart(userId);
    }
    async removeItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const item = await this.prisma.cartItem.findFirst({
            where: { id: itemId, cartId: cart.id },
        });
        if (!item) {
            throw new Error('Sản phẩm không có trong giỏ hàng');
        }
        await this.prisma.cartItem.delete({ where: { id: itemId } });
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
        });
        if (cart) {
            await this.prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }
        return { message: 'Đã xóa toàn bộ giỏ hàng' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map