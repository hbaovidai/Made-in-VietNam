import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  // Tạo mã đơn hàng: MIVN-20260507-XXX
  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 9000 + 1000);
    return `MIVN-${dateStr}-${random}`;
  }

  // Tạo đơn hàng từ giỏ hàng
  async createOrder(
    userId: string,
    data: {
      recipientName: string;
      recipientPhone: string;
      shippingAddress: string;
      note?: string;
      paymentMethod?: 'COD' | 'BANK_TRANSFER';
    },
  ) {
    // 1. Lấy giỏ hàng
    const cart = await this.cartService.getCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // 2. Nhóm sản phẩm theo Supplier
    const groupedBySupplier: Record<string, typeof cart.items> = {};
    for (const item of cart.items) {
      const supplierId = item.product.supplierId;
      if (!groupedBySupplier[supplierId]) {
        groupedBySupplier[supplierId] = [];
      }
      groupedBySupplier[supplierId].push(item);
    }

    // 3. Tạo 1 đơn hàng cho mỗi Supplier
    const orders = [];
    const shippingFee = 30000; // Phí vận chuyển cố định 30.000đ

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

    // 4. Xóa giỏ hàng sau khi đặt
    await this.cartService.clearCart(userId);

    return {
      message: `Đặt hàng thành công! Đã tạo ${orders.length} đơn hàng.`,
      orders,
    };
  }

  // Lấy đơn hàng của Buyer
  async getBuyerOrders(userId: string) {
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

  // Lấy đơn hàng của Supplier
  async getSupplierOrders(userId: string) {
    // Tìm supplier từ userId
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier) {
      throw new NotFoundException('Không tìm thấy nhà cung cấp');
    }

    return this.prisma.order.findMany({
      where: { supplierId: supplier.id },
      include: {
        items: {
          include: {
            product: { select: { id: true, slug: true, images: true } },
          },
        },
        buyer: { select: { id: true, fullName: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Chi tiết đơn hàng
  async getOrderDetail(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: { select: { id: true, slug: true, images: true } },
          },
        },
        supplier: { select: { id: true, companyName: true, logo: true, companyPhone: true } },
        buyer: { select: { id: true, fullName: true, email: true, phone: true } },
      },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Kiểm tra quyền xem
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    
    if (order.buyerId !== userId && supplier?.id !== order.supplierId) {
      throw new ForbiddenException('Bạn không có quyền xem đơn hàng này');
    }

    return order;
  }

  // Cập nhật trạng thái đơn hàng (Supplier)
  async updateOrderStatus(
    userId: string,
    orderId: string,
    status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED',
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier) {
      throw new ForbiddenException('Chỉ nhà cung cấp mới có thể cập nhật trạng thái');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.supplierId !== supplier.id) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Nếu trạng thái là DELIVERED + COD → tự động đánh dấu PAID
    const updateData: any = { status };
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

  // Hủy đơn hàng (Buyer - chỉ khi PENDING)
  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.buyerId !== userId) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xác nhận');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });
  }

  // ===== ADMIN =====

  async getAllOrders(query: { page?: number; limit?: number; status?: string }) {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
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
          buyer: { select: { id: true, fullName: true, email: true, phone: true } },
          supplier: { select: { id: true, companyName: true, logo: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async adminUpdateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    const updateData: any = { status };
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
}
