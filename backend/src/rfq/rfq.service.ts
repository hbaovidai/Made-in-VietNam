import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRFQDto,
  CreateQuoteDto,
  UpdateRFQStatusDto,
  UpdateQuoteStatusDto,
} from './dto/rfq.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { SupplierStatus } from '@prisma/client';

@Injectable()
export class RfqService {
  private readonly MAX_QUOTES_PER_RFQ = 10;

  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  // ================= RFQ (For Buyers) =================

  async createRFQ(buyerId: string, dto: CreateRFQDto) {
    const rfq = await this.prisma.rFQ.create({
      data: {
        buyerId,
        productName: dto.productName,
        category: dto.category,
        quantity: dto.quantity,
        quantityUnit: dto.quantityUnit,
        description: dto.description,
        budget: dto.budget,
        destination: dto.destination,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        contactPhone: dto.contactPhone,
        expiresAt: new Date(dto.expiresAt),
      },
    });

    // Notify all verified suppliers about the new RFQ
    try {
      const verifiedSuppliers = await this.prisma.supplier.findMany({
        where: { status : SupplierStatus.VERIFIED },
        select: { userId: true },
      });
      if (verifiedSuppliers.length > 0) {
        await this.prisma.notification.createMany({
          data: verifiedSuppliers.map((s) => ({
            userId: s.userId,
            title: 'New RFQ Available',
            message: `A buyer is looking for "${dto.productName}" (${dto.quantity} ${dto.quantityUnit}). Submit your quote now!`,
            type: 'info',
            link: `/dashboard/supplier/rfqs`,
          })),
        });
      }
    } catch (err) {
      console.error('Failed to notify suppliers about new RFQ:', err);
    }

    return rfq;
  }

  async getBuyerRFQs(buyerId: string) {
    return this.prisma.rFQ.findMany({
      where: { buyerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { quotes: true } },
      },
    });
  }

  // ================= QUOTES (For Suppliers) =================

  async submitQuote(supplierId: string, dto: CreateQuoteDto) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id: dto.rfqId },
      include: { _count: { select: { quotes: true } } },
    });
    if (!rfq) throw new NotFoundException('RFQ không tồn tại');
    if (rfq.status === 'CLOSED' || rfq.status === 'EXPIRED') {
      throw new ForbiddenException('Không thể báo giá cho RFQ này');
    }

    // Check if max quotes reached
    if (rfq._count.quotes >= this.MAX_QUOTES_PER_RFQ) {
      throw new ForbiddenException(
        `RFQ này đã nhận đủ ${this.MAX_QUOTES_PER_RFQ} báo giá. Không thể gửi thêm.`,
      );
    }

    // Check if supplier already quoted
    const existingQuote = await this.prisma.quote.findFirst({
      where: { rfqId: dto.rfqId, supplierId },
    });
    if (existingQuote)
      throw new ForbiddenException('Bạn đã báo giá cho RFQ này rồi');

    const quote = await this.prisma.quote.create({
      data: {
        rfqId: dto.rfqId,
        supplierId,
        price: dto.price,
        currency: dto.currency,
        leadTime: dto.leadTime,
        message: dto.message,
      },
    });

    // Auto-close RFQ if max quotes reached after this one
    const newQuoteCount = rfq._count.quotes + 1;
    if (newQuoteCount >= this.MAX_QUOTES_PER_RFQ) {
      await this.prisma.rFQ.update({
        where: { id: dto.rfqId },
        data: { status: 'CLOSED' },
      });
    }

    // Notify the buyer that a new quote was received
    try {
      const supplier = await this.prisma.supplier.findUnique({
        where: { id: supplierId },
        select: { companyName: true },
      });
      await this.notificationsService.createNotification({
        userId: rfq.buyerId,
        title: 'New Quote Received',
        message: `${supplier?.companyName || 'A supplier'} submitted a quote for your RFQ "${rfq.productName}".`,
        type: 'success',
        link: `/dashboard/buyer/rfqs`,
      });
    } catch (err) {
      console.error('Failed to notify buyer about new quote:', err);
    }

    return quote;
  }

  async getRFQDetails(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: {
        buyer: {
          select: { id: true, fullName: true, email: true, phone: true },
        },
        quotes: {
          include: {
            supplier: {
              select: {
                id: true,
                companyName: true,
                logo: true,
                is_verified: true,
                status: true,
                userId: true,
              },
            },
          },
          orderBy: { price: 'asc' },
        },
      },
    });
    if (!rfq) throw new NotFoundException('RFQ không tồn tại');
    return rfq;
  }

  async acceptQuote(quoteId: string, buyerId: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        rfq: true,
        supplier: { select: { userId: true, companyName: true } },
      },
    });
    if (!quote) throw new NotFoundException('Báo giá không tồn tại');
    if (quote.rfq.buyerId !== buyerId)
      throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này');

    // Accept the chosen quote
    await this.prisma.quote.update({
      where: { id: quoteId },
      data: { status: 'ACCEPTED' },
    });

    // Reject all other quotes for this RFQ
    await this.prisma.quote.updateMany({
      where: {
        rfqId: quote.rfqId,
        id: { not: quoteId },
      },
      data: { status: 'REJECTED' },
    });

    // Close the RFQ
    await this.prisma.rFQ.update({
      where: { id: quote.rfqId },
      data: { status: 'CLOSED' },
    });

    // Notify the winning supplier
    try {
      await this.notificationsService.createNotification({
        userId: quote.supplier.userId,
        title: 'Quote Accepted!',
        message: `Your quote for RFQ "${quote.rfq.productName}" has been accepted by the buyer. Contact them to finalize the deal.`,
        type: 'success',
        link: `/dashboard/supplier/rfqs`,
      });
    } catch (err) {
      console.error('Failed to notify supplier about accepted quote:', err);
    }

    return {
      message: 'Đã chấp nhận báo giá',
      supplierUserId: quote.supplier.userId,
    };
  }

  // ================= Public/Marketplace =================

  async getOpenRFQs(isVerified = true) {
    const rfqs = await this.prisma.rFQ.findMany({
      where: {
        status: { in: ['OPEN'] },
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        buyer: { select: { fullName: true } },
        _count: { select: { quotes: true } },
      },
    });

    // Unverified suppliers only see limited info (title, category, quantity)
    if (!isVerified) {
      return rfqs.map((rfq) => ({
        id: rfq.id,
        productName: rfq.productName,
        category: rfq.category,
        quantity: rfq.quantity,
        quantityUnit: rfq.quantityUnit,
        status: rfq.status,
        expiresAt: rfq.expiresAt,
        createdAt: rfq.createdAt,
        _count: rfq._count,
        // Hidden fields for free users
        description: null,
        budget: null,
        destination: null,
        contactEmail: null,
        contactName: null,
        contactPhone: null,
        buyer: { fullName: 'Ẩn danh' },
        _restricted: true,
      }));
    }

    return rfqs.map((rfq) => ({ ...rfq, _restricted: false }));
  }
}
