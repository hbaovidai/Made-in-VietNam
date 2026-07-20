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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, body) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const product = await this.prisma.product.findUnique({ where: { id: body.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const completedOrder = await this.prisma.order.findFirst({
            where: {
                buyerId: userId,
                status: 'DELIVERED',
                items: {
                    some: {
                        productId: body.productId,
                    },
                },
            },
        });
        const verifiedPurchase = !!completedOrder;
        const review = await this.prisma.productReview.create({
            data: {
                productId: body.productId,
                userId,
                rating: body.rating,
                content: body.content,
                images: body.images || [],
                verifiedPurchase,
                authorName: user.fullName,
                authorEmail: user.email,
                status: 'PENDING',
            },
        });
        return review;
    }
    async getProductReviews(productId) {
        return this.prisma.productReview.findMany({
            where: { productId, status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll() {
        return this.prisma.productReview.findMany({
            include: {
                product: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status) {
        const review = await this.prisma.productReview.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const updated = await this.prisma.productReview.update({
            where: { id },
            data: { status },
        });
        await this.recalculateProductRating(review.productId);
        return updated;
    }
    async delete(id) {
        const review = await this.prisma.productReview.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        await this.prisma.productReview.delete({ where: { id } });
        await this.recalculateProductRating(review.productId);
        return { success: true };
    }
    async incrementHelpful(id) {
        const review = await this.prisma.productReview.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.productReview.update({
            where: { id },
            data: {
                helpfulCount: {
                    increment: 1,
                },
            },
        });
    }
    async addSellerReply(id, reply) {
        const review = await this.prisma.productReview.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        return this.prisma.productReview.update({
            where: { id },
            data: {
                sellerReply: reply,
                sellerRepliedAt: new Date(),
            },
        });
    }
    async recalculateProductRating(productId) {
        const approvedReviews = await this.prisma.productReview.findMany({
            where: { productId, status: 'APPROVED' },
        });
        const reviewCount = approvedReviews.length;
        const avgRating = reviewCount > 0
            ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;
        const roundedRating = Math.round(avgRating * 10) / 10;
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                reviewCount,
                rating: roundedRating,
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map