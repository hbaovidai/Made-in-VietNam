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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SuppliersService = class SuppliersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, industry, page = 1, limit = 20 } = query;
        const where = {};
        if (search) {
            where.companyName = { contains: search, mode: 'insensitive' };
        }
        if (industry) {
            where.industries = { some: { industry } };
        }
        const [suppliers, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                include: {
                    industries: { select: { industry: true } },
                    markets: { select: { market: true } },
                    certifications: { select: { name: true } },
                    _count: { select: { products: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.supplier.count({ where }),
        ]);
        return {
            data: suppliers,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findBySlug(slug) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { slug },
            include: {
                user: { select: { fullName: true, email: true } },
                industries: { select: { industry: true } },
                markets: { select: { market: true } },
                certifications: true,
                products: {
                    where: { status: 'ACTIVE' },
                    take: 8,
                    include: {
                        category: { select: { name: true, slug: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                _count: { select: { products: true } },
            },
        });
        if (!supplier)
            throw new common_1.NotFoundException('Nhà cung cấp không tồn tại');
        return supplier;
    }
    async update(supplierId, dto) {
        const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
        if (!supplier)
            throw new common_1.NotFoundException('Nhà cung cấp không tồn tại');
        const { industries, markets, ...data } = dto;
        const updated = await this.prisma.supplier.update({
            where: { id: supplierId },
            data,
        });
        if (industries) {
            await this.prisma.supplierIndustry.deleteMany({ where: { supplierId } });
            await this.prisma.supplierIndustry.createMany({
                data: industries.map((industry) => ({ supplierId, industry })),
            });
        }
        if (markets) {
            await this.prisma.supplierMarket.deleteMany({ where: { supplierId } });
            await this.prisma.supplierMarket.createMany({
                data: markets.map((market) => ({ supplierId, market })),
            });
        }
        return this.findBySlug(updated.slug);
    }
    async addCertification(supplierId, data) {
        return this.prisma.certification.create({
            data: { supplierId, ...data },
        });
    }
    async deleteCertification(certId, supplierId) {
        const cert = await this.prisma.certification.findUnique({ where: { id: certId } });
        if (!cert || cert.supplierId !== supplierId)
            throw new common_1.NotFoundException('Chứng nhận không tồn tại');
        await this.prisma.certification.delete({ where: { id: certId } });
        return { message: 'Đã xóa chứng nhận' };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map