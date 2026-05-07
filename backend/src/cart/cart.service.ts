import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // Lấy hoặc tạo giỏ hàng cho user
  private async getOrCreateCart(userId: string) {
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

  // Lấy giỏ hàng hiện tại
  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return cart;
  }

  // Thêm sản phẩm vào giỏ
  async addItem(userId: string, productId: string, quantity: number) {
    const cart = await this.getOrCreateCart(userId);

    // Kiểm tra sản phẩm có tồn tại không
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    // Kiểm tra đã có trong giỏ chưa
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (existingItem) {
      // Cập nhật số lượng
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Thêm mới
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

  // Cập nhật số lượng
  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    // Xác minh item thuộc về user
    const cart = await this.getOrCreateCart(userId);
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new Error('Sản phẩm không có trong giỏ hàng');
    }

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    return this.getCart(userId);
  }

  // Xóa 1 item khỏi giỏ
  async removeItem(userId: string, itemId: string) {
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

  // Xóa toàn bộ giỏ hàng
  async clearCart(userId: string) {
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
}
