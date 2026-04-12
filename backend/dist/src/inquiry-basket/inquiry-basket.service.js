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
exports.InquiryBasketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InquiryBasketService = class InquiryBasketService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBasket(userId) {
        let basket = await this.prisma.inquiryBasket.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                minPrice: true,
                                maxPrice: true,
                                unit: true,
                                images: true,
                                supplier: { select: { companyName: true } },
                            },
                        },
                    },
                },
            },
        });
        if (!basket) {
            basket = await this.prisma.inquiryBasket.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    minPrice: true,
                                    maxPrice: true,
                                    unit: true,
                                    images: true,
                                    supplier: { select: { companyName: true } },
                                },
                            },
                        },
                    },
                },
            });
        }
        return basket;
    }
    async addItem(userId, dto) {
        const basket = await this.getBasket(userId);
        const existingItem = await this.prisma.inquiryItem.findFirst({
            where: { basketId: basket.id, productId: dto.productId },
        });
        if (existingItem) {
            return this.prisma.inquiryItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + dto.quantity,
                    note: dto.note || existingItem.note,
                },
            });
        }
        return this.prisma.inquiryItem.create({
            data: {
                basketId: basket.id,
                productId: dto.productId,
                quantity: dto.quantity,
                note: dto.note,
            },
        });
    }
    async removeItem(itemId, userId) {
        const basket = await this.getBasket(userId);
        const item = await this.prisma.inquiryItem.findUnique({
            where: { id: itemId },
        });
        if (!item || item.basketId !== basket.id)
            throw new common_1.NotFoundException('Item không tồn tại hoặc không thuộc giỏ của bạn');
        await this.prisma.inquiryItem.delete({ where: { id: itemId } });
        return { message: 'Đã xóa khỏi giỏ' };
    }
};
exports.InquiryBasketService = InquiryBasketService;
exports.InquiryBasketService = InquiryBasketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InquiryBasketService);
//# sourceMappingURL=inquiry-basket.service.js.map