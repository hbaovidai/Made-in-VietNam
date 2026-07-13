"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
const bcrypt = __importStar(require("bcrypt"));
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
        if (query.categorySlug)
            where.categories = { some: { categorySlug: query.categorySlug } };
        if (query.status)
            where.status = query.status;
        const [suppliers, total] = await Promise.all([
            this.prisma.supplier.findMany({
                where,
                orderBy: { updatedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    categories: true,
                    channels: true,
                    industries: { select: { industry: true } },
                    addresses: {
                        where: { isPrimary: true },
                        select: { supplierSlug: true, address: true, isPrimary: true },
                    },
                },
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
            where: {
                status: client_1.SupplierStatus.VERIFIED,
                ...(isUUID ? { id: slugOrId } : { slug: slugOrId }),
            },
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
                categories: true, channels: true,
                addresses: {
                    where: { isPrimary: true },
                    select: { isPrimary: true, address: true }
                },
                _count: { select: { products: true } },
            },
        });
        if (!supplier)
            throw new common_1.NotFoundException('Nhà cung cấp không tồn tại');
        return supplier;
    }
    async findBySlugAdmin(slugOrId) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId);
        const supplier = await this.prisma.supplier.findUnique({
            where: { ...(isUUID ? { id: slugOrId } : { slug: slugOrId }), },
            include: {
                categories: true,
                addresses: {
                    where: { isPrimary: true },
                    select: { address: true, isPrimary: true }
                },
                channels: true
            }
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
                legalRepName: data.legalRepName,
                contactPhone: data.contactPhone,
                slug: `${slug}-${Date.now()}`,
                accountHolderRole: data.accountHolderRole,
            },
        });
        return supplier;
    }
    async createFakeProfile(dto) {
        console.log(dto);
        try {
            const existingUser = await this.prisma.user.findFirst({
                where: { email: dto.contactEmail },
                select: { email: true }
            });
            if (existingUser)
                return { success: false, message: 'Email đã được sử dụng' };
            const existingCompany = await this.prisma.supplier.findFirst({
                where: { taxCode: dto.taxCode },
                select: { id: true }
            });
            if (existingCompany)
                return { success: false, message: 'Doanh nghiệp đã tồn tại.' };
            const passwordHash = await bcrypt.hash((0, uuid_1.v4)(), 10);
            const slug = dto.companyName
                .toLowerCase()
                .replace(/[^A-Za-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            const { website, facebook, shopee, instagram, categoryOptions, primaryLocation, ...supplierData } = dto;
            await this.prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: dto.contactEmail,
                        phone: dto.contactPhone,
                        passwordHash: passwordHash,
                        role: client_1.Role.SUPPLIER,
                        fullName: dto.companyName,
                    },
                });
                const supplierProfile = await tx.supplier.create({
                    data: {
                        userId: user.id,
                        slug: `${slug}-${dto.taxCode}`,
                        ...supplierData,
                        isFake: true
                    },
                });
                if (website)
                    await tx.supplierChannelMap.create({
                        data: {
                            supplierSlug: supplierProfile.slug, url: website, type: client_1.SaleChannelType.CUSTOM_WEBSITE
                        }
                    });
                if (facebook)
                    await tx.supplierChannelMap.create({
                        data: {
                            supplierSlug: supplierProfile.slug, url: facebook, type: client_1.SaleChannelType.FACEBOOK
                        }
                    });
                if (shopee)
                    await tx.supplierChannelMap.create({
                        data: {
                            supplierSlug: supplierProfile.slug, url: shopee, type: client_1.SaleChannelType.SHOPEE
                        }
                    });
                if (instagram)
                    await tx.supplierChannelMap.create({
                        data: {
                            supplierSlug: supplierProfile.slug, url: instagram, type: client_1.SaleChannelType.INSTAGRAM
                        }
                    });
                await tx.supplierCategoryMap.createMany({
                    data: categoryOptions.map((opt) => {
                        return { supplierSlug: supplierProfile.slug, categorySlug: opt.slug, categoryLevel: 1, };
                    })
                });
                await tx.supplierAddressMap.create({
                    data: {
                        supplierSlug: supplierProfile.slug, address: primaryLocation, isPrimary: true
                    }
                });
            });
            return {
                message: 'Đã tạo hồ sơ nhà cung cấp',
                success: true,
            };
        }
        catch (error) {
            console.error('Error creating fake profile:', error);
            return {
                message: error.message || 'Đã xảy ra lỗi hệ thống.',
                success: false
            };
        }
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
                status: isVerified ? client_1.SupplierStatus.VERIFIED : client_1.SupplierStatus.APPLICATION_PENDING
            }
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