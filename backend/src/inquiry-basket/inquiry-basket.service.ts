import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';

@Injectable()
export class InquiryBasketService {
  constructor(private prisma: PrismaService) {}

  async getBasket(userId: string) {
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

  async addItem(userId: string, dto: AddInquiryItemDto) {
    const basket = await this.getBasket(userId);

    // Check if item exists
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

  async removeItem(itemId: string, userId: string) {
    const basket = await this.getBasket(userId);
    const item = await this.prisma.inquiryItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.basketId !== basket.id)
      throw new NotFoundException(
        'Item không tồn tại hoặc không thuộc giỏ của bạn',
      );

    await this.prisma.inquiryItem.delete({ where: { id: itemId } });
    return { message: 'Đã xóa khỏi giỏ' };
  }
}
