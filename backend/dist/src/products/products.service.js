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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const notifications_service_1 = require("../notifications/notifications.service");
const translation_service_1 = require("../translation/translation.service");
let ProductsService = class ProductsService {
    prisma;
    notificationsService;
    translationService;
    constructor(prisma, notificationsService, translationService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
        this.translationService = translationService;
    }
    async findAll(query, isAdmin = false) {
        const { search, category, supplierId, page = 1, limit = 70, sortBy = 'createdAt', sortOrder = 'desc', status, } = query;
        const where = {};
        if (status) {
            where.status = status;
        }
        else if (!isAdmin) {
            where.status = 'ACTIVE';
        }
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = {
                OR: [{ slug: category }, { parent: { slug: category } }],
            };
        }
        if (supplierId) {
            where.supplierId = supplierId;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            slug: true,
                            status: true,
                            logo: true,
                        },
                    },
                    priceTiers: { orderBy: { minQty: 'asc' } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findByIdOrSlug(idOrSlug) {
        let product = null;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        if (isUUID) {
            product = await this.prisma.product.findUnique({
                where: { id: idOrSlug },
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            slug: true,
                            status: true,
                            logo: true,
                            description: true,
                            addresses: {
                                where: { isPrimary: true },
                                select: { isPrimary: true, address: true, }
                            },
                            industries: { select: { industry: true } },
                            markets: { select: { market: true } },
                            certifications: {
                                select: {
                                    id: true,
                                    name: true,
                                    issuedBy: true,
                                    issuedDate: true,
                                    expiryDate: true,
                                    documentUrl: true,
                                }
                            },
                        },
                    },
                    priceTiers: { orderBy: { minQty: 'asc' } },
                },
            });
        }
        if (!product) {
            product = await this.prisma.product.findUnique({
                where: { slug: idOrSlug },
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    supplier: {
                        select: {
                            id: true,
                            companyName: true,
                            slug: true,
                            status: true,
                            logo: true,
                            description: true,
                            addresses: {
                                where: { isPrimary: true },
                                select: { isPrimary: true, address: true }
                            },
                            industries: { select: { industry: true } },
                            markets: { select: { market: true } },
                            certifications: {
                                select: {
                                    id: true,
                                    name: true,
                                    issuedBy: true,
                                    issuedDate: true,
                                    expiryDate: true,
                                    documentUrl: true,
                                }
                            },
                        },
                    },
                    priceTiers: { orderBy: { minQty: 'asc' } },
                },
            });
        }
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        await this.prisma.product.update({
            where: { id: product.id },
            data: { viewCount: { increment: 1 } },
        });
        return product;
    }
    async findAllForSupplier(supplierId) {
        return this.prisma.product.findMany({
            where: { supplierId },
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true, slug: true } },
            },
        });
    }
    async create(supplierId, dto) {
        const slug = dto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') +
            '-' +
            Date.now();
        const { priceTiers, ...productData } = dto;
        const product = await this.prisma.$transaction(async (tx) => {
            const created = await tx.product.create({
                data: {
                    supplierId,
                    name: productData.name,
                    slug,
                    description: productData.description,
                    pricingMode: productData.pricingMode || 'STANDARD',
                    minPrice: productData.minPrice,
                    maxPrice: productData.maxPrice,
                    currency: productData.currency || 'VND',
                    unit: productData.unit,
                    moq: productData.moq,
                    moqUnit: productData.moqUnit,
                    categoryId: productData.categoryId,
                    images: productData.images || [],
                    rfqMinQuantity: productData.rfqMinQuantity || null,
                },
                include: {
                    category: { select: { name: true, slug: true } },
                },
            });
            if (priceTiers?.length && productData.pricingMode === 'TIERED') {
                await tx.priceTier.createMany({
                    data: priceTiers.map((t) => ({
                        productId: created.id,
                        minQty: t.minQty,
                        maxQty: t.maxQty || null,
                        price: t.price,
                    })),
                });
            }
            return created;
        });
        this.translationService
            .translateProduct(dto.name, dto.description)
            .then(async (translated) => {
            if (translated.nameEn || translated.descriptionEn) {
                await this.prisma.product.update({
                    where: { id: product.id },
                    data: {
                        nameEn: translated.nameEn,
                        descriptionEn: translated.descriptionEn,
                    },
                });
            }
        })
            .catch((err) => console.error('Auto-translate product failed:', err));
        try {
            await this.notificationsService.notifyAdmins({
                title: 'Sản phẩm mới cần duyệt',
                message: `Xưởng vừa đăng sản phẩm "${product.name}". Vui lòng kiểm duyệt nội dung.`,
                link: '/dashboard/admin/products',
                type: 'warning',
            });
        }
        catch (err) {
            console.error('Failed to notify admins:', err);
        }
        return product;
    }
    async update(productId, supplierId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        if (supplierId && product.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền chỉnh sửa');
        let newStatus = dto.status || product.status;
        if (supplierId && product.status === client_1.ProductStatus.REJECTED) {
            newStatus = client_1.ProductStatus.PENDING;
        }
        if (supplierId &&
            newStatus === client_1.ProductStatus.ACTIVE &&
            product.status !== client_1.ProductStatus.ACTIVE) {
            newStatus = client_1.ProductStatus.PENDING;
        }
        const { priceTiers, ...updateData } = dto;
        const updated = await this.prisma.$transaction(async (tx) => {
            const result = await tx.product.update({
                where: { id: productId },
                data: { ...updateData, status: newStatus },
                include: {
                    category: { select: { name: true, slug: true } },
                },
            });
            if (priceTiers !== undefined) {
                await tx.priceTier.deleteMany({ where: { productId } });
                if (priceTiers.length > 0 && updateData.pricingMode === 'TIERED') {
                    await tx.priceTier.createMany({
                        data: priceTiers.map((t) => ({
                            productId,
                            minQty: t.minQty,
                            maxQty: t.maxQty || null,
                            price: t.price,
                        })),
                    });
                }
            }
            return result;
        });
        if (dto.name || dto.description) {
            this.translationService
                .translateProduct(dto.name || product.name, dto.description || product.description || undefined)
                .then(async (translated) => {
                if (translated.nameEn || translated.descriptionEn) {
                    await this.prisma.product.update({
                        where: { id: productId },
                        data: {
                            ...(translated.nameEn && { nameEn: translated.nameEn }),
                            ...(translated.descriptionEn && {
                                descriptionEn: translated.descriptionEn,
                            }),
                        },
                    });
                }
            })
                .catch((err) => console.error('Auto-translate product update failed:', err));
        }
        return updated;
    }
    async delete(productId, supplierId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        if (supplierId && product.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền xóa');
        await this.prisma.product.delete({ where: { id: productId } });
        return { message: 'Đã xóa sản phẩm' };
    }
    async findRelated(productId, limit = 6) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            return [];
        return this.prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: productId },
                status: 'ACTIVE',
            },
            include: {
                supplier: { select: { companyName: true, slug: true } },
            },
            take: limit,
        });
    }
    async verifyProduct(productId, status, reason) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: { supplier: { select: { userId: true, companyName: true } } },
        });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        const updated = await this.prisma.product.update({
            where: { id: productId },
            data: { status },
        });
        try {
            const isApproved = status === 'ACTIVE';
            await this.notificationsService.createNotification({
                userId: product.supplier.userId,
                title: isApproved ? 'Product Approved' : 'Product Rejected',
                message: isApproved
                    ? `Your product "${product.name}" has been approved and is now live on the marketplace.`
                    : `Your product "${product.name}" has been rejected by admin. Reason: ${reason || 'No reason specified'}. Please review and resubmit.`,
                type: isApproved ? 'success' : 'warning',
                link: '/dashboard/supplier/products',
            });
        }
        catch (err) {
            console.error('Failed to notify supplier about product verification:', err);
        }
        return updated;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService,
        translation_service_1.TranslationService])
], ProductsService);
//# sourceMappingURL=products.service.js.map