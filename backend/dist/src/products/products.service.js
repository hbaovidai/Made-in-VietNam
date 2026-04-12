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
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, category, supplierId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const where = {
            status: 'ACTIVE',
        };
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }
        if (category) {
            where.category = {
                OR: [
                    { slug: category },
                    { parent: { slug: category } }
                ]
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
                    supplier: { select: { id: true, companyName: true, slug: true, isVerified: true, logo: true } },
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
                            isVerified: true,
                            logo: true,
                            description: true,
                            city: true,
                            province: true,
                            industries: { select: { industry: true } },
                            markets: { select: { market: true } },
                        },
                    },
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
                            isVerified: true,
                            logo: true,
                            description: true,
                            city: true,
                            province: true,
                            industries: { select: { industry: true } },
                            markets: { select: { market: true } },
                        },
                    },
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
    async create(supplierId, dto) {
        const slug = dto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            + '-' + Date.now();
        return this.prisma.product.create({
            data: {
                supplierId,
                name: dto.name,
                slug,
                description: dto.description,
                minPrice: dto.minPrice,
                maxPrice: dto.maxPrice,
                currency: dto.currency || 'VND',
                unit: dto.unit,
                moq: dto.moq,
                moqUnit: dto.moqUnit,
                categoryId: dto.categoryId,
                images: dto.images || [],
            },
            include: {
                category: { select: { name: true, slug: true } },
            },
        });
    }
    async update(productId, supplierId, dto) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        if (product.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền chỉnh sửa');
        return this.prisma.product.update({
            where: { id: productId },
            data: dto,
            include: {
                category: { select: { name: true, slug: true } },
            },
        });
    }
    async delete(productId, supplierId) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        if (product.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền xóa');
        await this.prisma.product.delete({ where: { id: productId } });
        return { message: 'Đã xóa sản phẩm' };
    }
    async findRelated(productId, limit = 6) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map