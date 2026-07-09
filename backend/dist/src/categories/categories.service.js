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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const translation_service_1 = require("../translation/translation.service");
let CategoriesService = class CategoriesService {
    prisma;
    translationService;
    constructor(prisma, translationService) {
        this.prisma = prisma;
        this.translationService = translationService;
    }
    buildTree(categories) {
        const map = new Map();
        categories.forEach((category) => {
            map.set(category.id, {
                ...category,
                children: [],
            });
        });
        const roots = [];
        categories.forEach((category) => {
            const node = map.get(category.id);
            if (!category.parentId) {
                roots.push(node);
            }
            else {
                const parent = map.get(category.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            }
        });
        return roots;
    }
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });
        return this.buildTree(categories);
    }
    async findBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                children: true,
                products: {
                    where: { status: 'ACTIVE' },
                    take: 20,
                    include: {
                        supplier: {
                            select: { companyName: true, slug: true, status: true, },
                        },
                    },
                },
                _count: { select: { products: true } },
            },
        });
        if (!category)
            throw new common_1.NotFoundException('Danh mục không tồn tại');
        return category;
    }
    async create(dto) {
        const slug = dto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                slug,
                parentId: dto.parentId || null,
            },
        });
        this.translationService
            .translateCategory(dto.name)
            .then(async (nameEn) => {
            if (nameEn) {
                await this.prisma.category.update({
                    where: { id: category.id },
                    data: { nameEn },
                });
            }
        })
            .catch((err) => console.error('Auto-translate category failed:', err));
        return category;
    }
    async update(id, dto) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Danh mục không tồn tại');
        const data = {};
        if (dto.name) {
            data.name = dto.name;
            data.slug = dto.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
        if (dto.parentId !== undefined)
            data.parentId = dto.parentId || null;
        const updated = await this.prisma.category.update({ where: { id }, data });
        if (dto.name) {
            this.translationService
                .translateCategory(dto.name)
                .then(async (nameEn) => {
                if (nameEn) {
                    await this.prisma.category.update({
                        where: { id },
                        data: { nameEn },
                    });
                }
            })
                .catch((err) => console.error('Auto-translate category update failed:', err));
        }
        return updated;
    }
    async delete(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { products: true, children: true } } },
        });
        if (!category)
            throw new common_1.NotFoundException('Danh mục không tồn tại');
        if (category._count.products > 0) {
            throw new common_1.NotFoundException(`Không thể xóa — danh mục đang chứa ${category._count.products} sản phẩm`);
        }
        if (category._count.children > 0) {
            throw new common_1.NotFoundException(`Không thể xóa — danh mục có ${category._count.children} danh mục con`);
        }
        await this.prisma.category.delete({ where: { id } });
        return { message: 'Đã xóa danh mục' };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        translation_service_1.TranslationService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map