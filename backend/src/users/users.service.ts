import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // ==================== ADMIN: GET ALL USERS ====================
  async findAll(query: any = {}) {
    const { role, page = 1, limit = 20 } = query;
    const where: any = {};
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, email: true, fullName: true, role: true, 
          phone: true, status: true, createdAt: true,
          supplier: { select: { id: true, companyName: true, status: true, } }
        },
        skip: (+page - 1) * +limit,
        take: +limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(total / +limit),
      },
    };
  }

  // ADMIN: Khóa / Mở khóa tài khoản
  async toggleUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user.role === 'ADMIN')
      throw new NotFoundException('Không thể khóa tài khoản Admin');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
      },
    });
    return updated;
  }

  // ADMIN: Cập nhật vai trò người dùng
  async updateUserRole(userId: string, role: 'ADMIN' | 'SUPPLIER' | 'BUYER') {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
      },
    });
    return updated;
  }

  // ADMIN: Xóa người dùng hoàn toàn
  async deleteUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { supplier: { select: { id: true } } },
    });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    if (user.role === 'ADMIN')
      throw new NotFoundException('Không thể xóa tài khoản Admin');

    // Xóa tất cả dữ liệu liên quan trước
    await this.prisma.$transaction([
      this.prisma.savedProduct.deleteMany({ where: { userId } }),
      this.prisma.viewHistory.deleteMany({ where: { userId } }),
      this.prisma.notification.deleteMany({ where: { userId } }),
      this.prisma.auditLog.deleteMany({ where: { userId } }),
      // Xóa cart + items
      this.prisma.cartItem.deleteMany({ where: { cart: { userId } } }),
      this.prisma.cart.deleteMany({ where: { userId } }),
      // Xóa messages & conversations
      this.prisma.message.deleteMany({ where: { senderId: userId } }),
      this.prisma.conversationParticipant.deleteMany({ where: { userId } }),
      // Xóa user (cascade sẽ xóa supplier nếu có)
      this.prisma.user.delete({ where: { id: userId } }),
    ]);

    return { id: userId, fullName: user.fullName, email: user.email };
  }

  // ==================== SAVED PRODUCTS ====================

  async getSavedProducts(userId: string) {
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
          },
        },
      },
    });
    return saved.map((s: any) => s.product);
  }

  async saveProduct(userId: string, productId: string) {
    try {
      return await this.prisma.savedProduct.create({
        data: { userId, productId },
      });
    } catch (e) {
      // Ignored if already saved
      return { success: true };
    }
  }

  async unsaveProduct(userId: string, productId: string) {
    await this.prisma.savedProduct.deleteMany({
      where: { userId, productId },
    });
    return { success: true };
  }

  async clearSavedProducts(userId: string) {
    await this.prisma.savedProduct.deleteMany({
      where: { userId },
    });
    return { success: true };
  }

  // ==================== VIEW HISTORY ====================

  async getViewHistory(userId: string) {
    const history = await this.prisma.viewHistory.findMany({
      where: { userId },
      orderBy: { viewedAt: 'desc' },
      distinct: ['productId'],
      take: 20, // Keep it to recent 20
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
          },
        },
      },
    });
    return history.map((h: any) => ({
      ...h.product,
      historyId: h.id,
      viewedAt: h.viewedAt,
    }));
  }

  async recordView(userId: string, productId: string) {
    const existing = await this.prisma.viewHistory.findFirst({
      where: { userId, productId },
      orderBy: { viewedAt: 'desc' },
    });

    if (existing) {
      return this.prisma.viewHistory.update({
        where: { id: existing.id },
        data: { viewedAt: new Date() },
      });
    }

    return this.prisma.viewHistory.create({
      data: { userId, productId },
    });
  }

  async deleteHistoryItem(userId: string, historyId: string) {
    await this.prisma.viewHistory.deleteMany({
      where: { id: historyId, userId },
    });
    return { success: true };
  }

  async clearHistory(userId: string) {
    await this.prisma.viewHistory.deleteMany({
      where: { userId },
    });
    return { success: true };
  }
}
