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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSavedProducts(userId) {
        const saved = await this.prisma.savedProduct.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        minPrice: true,
                        maxPrice: true,
                        currency: true,
                        images: true,
                        slug: true,
                    }
                }
            }
        });
        return saved.map((s) => s.product);
    }
    async saveProduct(userId, productId) {
        try {
            return await this.prisma.savedProduct.create({
                data: { userId, productId }
            });
        }
        catch (e) {
            return { success: true };
        }
    }
    async unsaveProduct(userId, productId) {
        await this.prisma.savedProduct.deleteMany({
            where: { userId, productId }
        });
        return { success: true };
    }
    async clearSavedProducts(userId) {
        await this.prisma.savedProduct.deleteMany({
            where: { userId }
        });
        return { success: true };
    }
    async getViewHistory(userId) {
        const history = await this.prisma.viewHistory.findMany({
            where: { userId },
            orderBy: { viewedAt: 'desc' },
            distinct: ['productId'],
            take: 20,
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        minPrice: true,
                        maxPrice: true,
                        currency: true,
                        images: true,
                        slug: true,
                    }
                }
            }
        });
        return history.map((h) => ({ ...h.product, historyId: h.id, viewedAt: h.viewedAt }));
    }
    async recordView(userId, productId) {
        const existing = await this.prisma.viewHistory.findFirst({
            where: { userId, productId },
            orderBy: { viewedAt: 'desc' }
        });
        if (existing) {
            return this.prisma.viewHistory.update({
                where: { id: existing.id },
                data: { viewedAt: new Date() }
            });
        }
        return this.prisma.viewHistory.create({
            data: { userId, productId }
        });
    }
    async deleteHistoryItem(userId, historyId) {
        await this.prisma.viewHistory.deleteMany({
            where: { id: historyId, userId }
        });
        return { success: true };
    }
    async clearHistory(userId) {
        await this.prisma.viewHistory.deleteMany({
            where: { userId }
        });
        return { success: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map