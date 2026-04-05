import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRFQDto, CreateQuoteDto, UpdateRFQStatusDto, UpdateQuoteStatusDto } from './dto/rfq.dto';

@Injectable()
export class RfqService {
  constructor(private prisma: PrismaService) {}

  // ================= RFQ (For Buyers) =================

  async createRFQ(buyerId: string, dto: CreateRFQDto) {
    return this.prisma.rFQ.create({
      data: {
        buyerId,
        productName: dto.productName,
        category: dto.category,
        quantity: dto.quantity,
        quantityUnit: dto.quantityUnit,
        description: dto.description,
        budget: dto.budget,
        destination: dto.destination,
        expiresAt: new Date(dto.expiresAt),
      },
    });
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
    const rfq = await this.prisma.rFQ.findUnique({ where: { id: dto.rfqId } });
    if (!rfq) throw new NotFoundException('RFQ không tồn tại');
    if (rfq.status === 'CLOSED' || rfq.status === 'EXPIRED') {
      throw new ForbiddenException('Không thể báo giá cho RFQ này');
    }

    // Check if supplier already quoted
    const existingQuote = await this.prisma.quote.findFirst({
      where: { rfqId: dto.rfqId, supplierId },
    });
    if (existingQuote) throw new ForbiddenException('Bạn đã báo giá cho RFQ này rồi');

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

    // Update RFQ status to QUOTED if it was OPEN
    if (rfq.status === 'OPEN') {
      await this.prisma.rFQ.update({
        where: { id: dto.rfqId },
        data: { status: 'QUOTED' },
      });
    }

    return quote;
  }

  async getRFQDetails(id: string) {
    const rfq = await this.prisma.rFQ.findUnique({
      where: { id },
      include: {
        buyer: { select: { fullName: true, email: true, phone: true } },
        quotes: {
          include: {
            supplier: { select: { companyName: true, logo: true, isVerified: true } },
          },
          orderBy: { price: 'asc' }, // Sort by price by default
        },
      },
    });
    if (!rfq) throw new NotFoundException('RFQ không tồn tại');
    return rfq;
  }

  // ================= Public/Marketplace =================
  
  async getOpenRFQs() {
    return this.prisma.rFQ.findMany({
      where: { status: { in: ['OPEN', 'QUOTED'] }, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        buyer: { select: { fullName: true } }, // limited info for privacy
        _count: { select: { quotes: true } },
      },
    });
  }
}
