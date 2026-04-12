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
                contactEmail: dto.contactEmail,
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
        const rfq = await this.prisma.rFQ.findUnique({ where: { id: dto.rfqId } });
        if (!rfq)
            throw new common_1.NotFoundException('RFQ không tồn tại');
        if (rfq.status === 'CLOSED' || rfq.status === 'EXPIRED') {
            throw new common_1.ForbiddenException('Không thể báo giá cho RFQ này');
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
        if (rfq.status === 'OPEN') {
            await this.prisma.rFQ.update({
                where: { id: dto.rfqId },
                data: { status: 'QUOTED' },
            });
        }
        return quote;
    }
    async getRFQDetails(id) {
        const rfq = await this.prisma.rFQ.findUnique({
            where: { id },
            include: {
                buyer: { select: { fullName: true, email: true, phone: true } },
                quotes: {
                    include: {
                        supplier: {
                            select: { companyName: true, logo: true, isVerified: true },
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
    async getOpenRFQs() {
        return this.prisma.rFQ.findMany({
            where: {
                status: { in: ['OPEN', 'QUOTED'] },
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                buyer: { select: { fullName: true } },
                _count: { select: { quotes: true } },
            },
        });
    }
};
exports.RfqService = RfqService;
exports.RfqService = RfqService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RfqService);
//# sourceMappingURL=rfq.service.js.map