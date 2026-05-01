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
exports.RfqService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RfqService = class RfqService {
    prisma;
    MAX_QUOTES_PER_RFQ = 10;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRFQ(buyerId, dto) {
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
                contactName: dto.contactName,
                contactEmail: dto.contactEmail,
                contactPhone: dto.contactPhone,
                expiresAt: new Date(dto.expiresAt),
            },
        });
    }
    async getBuyerRFQs(buyerId) {
        return this.prisma.rFQ.findMany({
            where: { buyerId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: { select: { quotes: true } },
            },
        });
    }
    async submitQuote(supplierId, dto) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id: dto.rfqId },
            include: { _count: { select: { quotes: true } } },
        });
        if (!rfq)
            throw new common_1.NotFoundException('RFQ không tồn tại');
        if (rfq.status === 'CLOSED' || rfq.status === 'EXPIRED') {
            throw new common_1.ForbiddenException('Không thể báo giá cho RFQ này');
        }
        if (rfq._count.quotes >= this.MAX_QUOTES_PER_RFQ) {
            throw new common_1.ForbiddenException(`RFQ này đã nhận đủ ${this.MAX_QUOTES_PER_RFQ} báo giá. Không thể gửi thêm.`);
        }
        const existingQuote = await this.prisma.quote.findFirst({
            where: { rfqId: dto.rfqId, supplierId },
        });
        if (existingQuote)
            throw new common_1.ForbiddenException('Bạn đã báo giá cho RFQ này rồi');
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
        const newQuoteCount = rfq._count.quotes + 1;
        if (newQuoteCount >= this.MAX_QUOTES_PER_RFQ) {
            await this.prisma.rFQ.update({
                where: { id: dto.rfqId },
                data: { status: 'CLOSED' },
            });
        }
        return quote;
    }
    async getRFQDetails(id) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id },
            include: {
                buyer: { select: { id: true, fullName: true, email: true, phone: true } },
                quotes: {
                    include: {
                        supplier: {
                            select: { id: true, companyName: true, logo: true, isVerified: true, userId: true },
                        },
                    },
                    orderBy: { price: 'asc' },
                },
            },
        });
        if (!rfq)
            throw new common_1.NotFoundException('RFQ không tồn tại');
        return rfq;
    }
    async acceptQuote(quoteId, buyerId) {
        const quote = await this.prisma.quote.findUnique({
            where: { id: quoteId },
            include: {
                rfq: true,
                supplier: { select: { userId: true, companyName: true } },
            },
        });
        if (!quote)
            throw new common_1.NotFoundException('Báo giá không tồn tại');
        if (quote.rfq.buyerId !== buyerId)
            throw new common_1.ForbiddenException('Bạn không có quyền thực hiện thao tác này');
        await this.prisma.quote.update({
            where: { id: quoteId },
            data: { status: 'ACCEPTED' },
        });
        await this.prisma.quote.updateMany({
            where: {
                rfqId: quote.rfqId,
                id: { not: quoteId },
            },
            data: { status: 'REJECTED' },
        });
        await this.prisma.rFQ.update({
            where: { id: quote.rfqId },
            data: { status: 'CLOSED' },
        });
        return { message: 'Đã chấp nhận báo giá', supplierUserId: quote.supplier.userId };
    }
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
};
exports.RfqService = RfqService;
exports.RfqService = RfqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RfqService);
//# sourceMappingURL=rfq.service.js.map