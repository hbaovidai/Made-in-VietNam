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
exports.LegalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LegalService = class LegalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async checkAndSeed() {
    }
    async findActive(pageKey = 'terms') {
        await this.checkAndSeed();
        return this.prisma.legalSection.findMany({
            where: { isActive: true, pageKey },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        });
    }
    async findAll(pageKey = 'terms') {
        await this.checkAndSeed();
        return this.prisma.legalSection.findMany({
            where: { pageKey },
            orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
        });
    }
    async findOne(id) {
        const section = await this.prisma.legalSection.findUnique({ where: { id } });
        if (!section) {
            throw new common_1.NotFoundException(`Legal section with ID ${id} not found`);
        }
        return section;
    }
    async create(dto) {
        const pageKey = dto.pageKey || 'terms';
        let sortOrder = dto.sortOrder;
        if (sortOrder === undefined || sortOrder === null) {
            const maxSection = await this.prisma.legalSection.findFirst({
                where: { pageKey },
                orderBy: { sortOrder: 'desc' },
            });
            sortOrder = maxSection ? maxSection.sortOrder + 1 : 0;
        }
        return this.prisma.legalSection.create({
            data: {
                pageKey,
                titleVi: dto.titleVi,
                titleEn: dto.titleEn,
                slug: dto.slug,
                contentVi: dto.contentVi,
                contentEn: dto.contentEn,
                sortOrder,
                isActive: dto.isActive ?? true,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.legalSection.update({
            where: { id },
            data: {
                pageKey: dto.pageKey,
                titleVi: dto.titleVi,
                titleEn: dto.titleEn,
                slug: dto.slug,
                contentVi: dto.contentVi,
                contentEn: dto.contentEn,
                sortOrder: dto.sortOrder,
                isActive: dto.isActive,
            },
        });
    }
    async delete(id) {
        await this.findOne(id);
        return this.prisma.legalSection.delete({ where: { id } });
    }
    async move(id, direction) {
        const section = await this.findOne(id);
        const pageKey = section.pageKey;
        const all = await this.findAll(pageKey);
        const currentIndex = all.findIndex((item) => item.id === id);
        if (currentIndex === -1) {
            throw new common_1.NotFoundException(`Legal section with ID ${id} not found`);
        }
        let targetIndex = -1;
        if (direction === 'up') {
            targetIndex = currentIndex - 1;
        }
        else if (direction === 'down') {
            targetIndex = currentIndex + 1;
        }
        if (targetIndex >= 0 && targetIndex < all.length) {
            const temp = all[currentIndex];
            all[currentIndex] = all[targetIndex];
            all[targetIndex] = temp;
            const updates = all.map((item, index) => this.prisma.legalSection.update({
                where: { id: item.id },
                data: { sortOrder: index },
            }));
            await this.prisma.$transaction(updates);
        }
        return this.findAll(pageKey);
    }
};
exports.LegalService = LegalService;
exports.LegalService = LegalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LegalService);
//# sourceMappingURL=legal.service.js.map