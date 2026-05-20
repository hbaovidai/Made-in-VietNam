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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULTS = {
    contact_email: 'contact@vieproduct.com',
    contact_phone: '+84 899 123 456',
    contact_address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
};
let SettingsService = class SettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll() {
        const rows = await this.prisma.siteSetting.findMany();
        const result = { ...DEFAULTS };
        for (const row of rows) {
            result[row.key] = row.value;
        }
        return result;
    }
    async get(key) {
        const row = await this.prisma.siteSetting.findUnique({ where: { key } });
        return row?.value ?? DEFAULTS[key] ?? '';
    }
    async updateMany(data) {
        const ops = Object.entries(data).map(([key, value]) => this.prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        }));
        await this.prisma.$transaction(ops);
        return this.getAll();
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map