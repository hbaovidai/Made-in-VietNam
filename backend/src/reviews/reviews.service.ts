import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, body: { productId: string; rating: number; content: string; images?: string[] }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const product = await this.prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) throw new NotFoundException('Product not found');

    // Check if user has a verified purchase
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
        status: 'PENDING', // Default to pending admin approval
      },
    });

    return review;
  }

  async getProductReviews(productId: string) {
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

  async updateStatus(id: string, status: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.productReview.update({
      where: { id },
      data: { status },
    });

    await this.recalculateProductRating(review.productId);

    return updated;
  }

  async delete(id: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    await this.prisma.productReview.delete({ where: { id } });

    await this.recalculateProductRating(review.productId);

    return { success: true };
  }

  async incrementHelpful(id: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.productReview.update({
      where: { id },
      data: {
        helpfulCount: {
          increment: 1,
        },
      },
    });
  }

  async addSellerReply(id: string, reply: string) {
    const review = await this.prisma.productReview.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.productReview.update({
      where: { id },
      data: {
        sellerReply: reply,
        sellerRepliedAt: new Date(),
      },
    });
  }

  private async recalculateProductRating(productId: string) {
    const approvedReviews = await this.prisma.productReview.findMany({
      where: { productId, status: 'APPROVED' },
    });

    const reviewCount = approvedReviews.length;
    const avgRating = reviewCount > 0
      ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

    // Round rating to 1 decimal place
    const roundedRating = Math.round(avgRating * 10) / 10;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        reviewCount,
        rating: roundedRating,
      },
    });
  }
}
