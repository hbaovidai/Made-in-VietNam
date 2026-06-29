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
        if (query.verificationStatus)
            where.verificationStatus = query.verificationStatus;
        const [suppliers, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
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
    async findBySlug(slugOrId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId);
        const supplier = await this.prisma.supplier.findFirst({
            where: isUUID ? { id: slugOrId } : { slug: slugOrId },
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
    async createProfile(userId, data) {
        const existing = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (existing) {
            return existing;
        }
        const slug = data.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const supplier = await this.prisma.supplier.create({
            data: {
                userId,
                companyName: data.companyName,
                businessType: data.businessType,
                description: data.description,
                taxCode: data.taxCode,
                companyEmail: data.companyEmail,
                companyPhone: data.companyPhone,
                legalRepresentative: data.legalRepresentative,
                slug: `${slug}-${Date.now()}`,
            },
        });
        return supplier;
    }
    async update(supplierId, dto) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId },
        });
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
        const cert = await this.prisma.certification.findUnique({
            where: { id: certId },
        });
        if (!cert || cert.supplierId !== supplierId)
            throw new common_1.NotFoundException('Chứng nhận không tồn tại');
        await this.prisma.certification.delete({ where: { id: certId } });
        return { message: 'Đã xóa chứng nhận' };
    }
    async verifySupplier(supplierId, isVerified) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { id: supplierId },
        });
        if (!supplier)
            throw new common_1.NotFoundException('Nhà cung cấp không tồn tại');
        const updated = await this.prisma.supplier.update({
            where: { id: supplierId },
            data: {
                isVerified,
                verificationStatus: isVerified ? 'VERIFIED' : 'UNVERIFIED',
            },
        });
        return updated;
    }
    async getStats(supplierId) {
        const [productCount, batchCount, qrCount, totalViews] = await Promise.all([
            this.prisma.product.count({ where: { supplierId, status: 'ACTIVE' } }),
            this.prisma.batch.count({ where: { supplierId } }),
            this.prisma.qRCode.count({ where: { batch: { supplierId } } }),
            this.prisma.product.aggregate({
                where: { supplierId },
                _sum: { viewCount: true },
            }),
        ]);
        return {
            products: productCount,
            batches: batchCount,
            qrCodes: qrCount,
            totalViews: totalViews._sum.viewCount || 0,
        };
    }
    async getAnalytics(supplierId) {
        const products = await this.prisma.product.findMany({
            where: { supplierId },
            select: { id: true, name: true, viewCount: true, status: true },
        });
        const productIds = products.map((p) => p.id);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const dailyViews = await this.prisma.viewHistory.groupBy({
            by: ['viewedAt'],
            where: {
                productId: { in: productIds },
                viewedAt: { gte: thirtyDaysAgo },
            },
            _count: { id: true },
        });
        const dailyMap = {};
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dailyMap[d.toISOString().slice(0, 10)] = 0;
        }
        for (const row of dailyViews) {
            const key = new Date(row.viewedAt).toISOString().slice(0, 10);
            if (dailyMap[key] !== undefined) {
                dailyMap[key] += row._count.id;
            }
        }
        const dailyData = Object.entries(dailyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, views]) => ({ date, views }));
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const monthlyViews = await this.prisma.viewHistory.groupBy({
            by: ['viewedAt'],
            where: {
                productId: { in: productIds },
                viewedAt: { gte: twelveMonthsAgo },
            },
            _count: { id: true },
        });
        const monthlyMap = {};
        for (let i = 11; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            monthlyMap[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`] = 0;
        }
        for (const row of monthlyViews) {
            const d = new Date(row.viewedAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyMap[key] !== undefined) {
                monthlyMap[key] += row._count.id;
            }
        }
        const monthlyData = Object.entries(monthlyMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, views]) => ({ month, views }));
        const topProducts = products
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 10)
            .map((p) => ({
            id: p.id,
            name: p.name,
            views: p.viewCount || 0,
            status: p.status,
        }));
        const totalViewsAll = products.reduce((sum, p) => sum + (p.viewCount || 0), 0);
        const activeProducts = products.filter((p) => p.status === 'ACTIVE').length;
        return {
            overview: {
                totalViews: totalViewsAll,
                totalProducts: products.length,
                activeProducts,
                avgViewsPerProduct: products.length > 0 ? Math.round(totalViewsAll / products.length) : 0,
            },
            dailyViews: dailyData,
            monthlyViews: monthlyData,
            topProducts,
        };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map