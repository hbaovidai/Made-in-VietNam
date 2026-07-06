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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RfqController = void 0;
const common_1 = require("@nestjs/common");
const rfq_service_1 = require("./rfq.service");
const rfq_dto_1 = require("./dto/rfq.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
let RfqController = class RfqController {
    rfqService;
    prisma;
    constructor(rfqService, prisma) {
        this.rfqService = rfqService;
        this.prisma = prisma;
    }
    async getOpenRFQs(currentUser) {
        let isVerified = true;
        if (currentUser.role === 'SUPPLIER') {
            const supplier = await this.prisma.supplier.findUnique({
                where: { userId: currentUser.id },
            });
            isVerified = supplier?.is_verified ?? false;
        }
        return this.rfqService.getOpenRFQs(isVerified);
    }
    getBuyerRFQs(buyerId, currentUser) {
        if (currentUser.id !== buyerId && currentUser.role !== 'ADMIN') {
            throw new common_1.ForbiddenException('Bạn chỉ có thể xem RFQ của chính mình');
        }
        return this.rfqService.getBuyerRFQs(buyerId);
    }
    getRFQDetails(id) {
        return this.rfqService.getRFQDetails(id);
    }
    createRFQ(dto, userId) {
        return this.rfqService.createRFQ(userId, dto);
    }
    acceptQuote(quoteId, userId) {
        return this.rfqService.acceptQuote(quoteId, userId);
    }
    async submitQuote(dto, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier)
            throw new common_1.ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
        if (!supplier.is_verified)
            throw new common_1.ForbiddenException('Chỉ nhà cung cấp đã xác thực mới được gửi báo giá. Vui lòng hoàn tất Xác thực Doanh nghiệp (KYB).');
        return this.rfqService.submitQuote(supplier.id, dto);
    }
};
exports.RfqController = RfqController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER', 'ADMIN'),
    (0, common_1.Get)('open'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RfqController.prototype, "getOpenRFQs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('buyer/:buyerId'),
    __param(0, (0, common_1.Param)('buyerId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "getBuyerRFQs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "getRFQDetails", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('BUYER'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rfq_dto_1.CreateRFQDto, String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "createRFQ", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('BUYER'),
    (0, common_1.Put)('quotes/:quoteId/accept'),
    __param(0, (0, common_1.Param)('quoteId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RfqController.prototype, "acceptQuote", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Post)('quotes'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rfq_dto_1.CreateQuoteDto, String]),
    __metadata("design:returntype", Promise)
], RfqController.prototype, "submitQuote", null);
exports.RfqController = RfqController = __decorate([
    (0, common_1.Controller)('rfqs'),
    __metadata("design:paramtypes", [rfq_service_1.RfqService,
        prisma_service_1.PrismaService])
], RfqController);
//# sourceMappingURL=rfq.controller.js.map