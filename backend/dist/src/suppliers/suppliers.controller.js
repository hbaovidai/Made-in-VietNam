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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const suppliers_service_1 = require("./suppliers.service");
const supplier_dto_1 = require("./dto/supplier.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let SuppliersController = class SuppliersController {
    suppliersService;
    prisma;
    auditLogService;
    constructor(suppliersService, prisma, auditLogService) {
        this.suppliersService = suppliersService;
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    findAll(query) {
        return this.suppliersService.findAll(query);
    }
    findBySlug(slug) {
        return this.suppliersService.findBySlug(slug);
    }
    getStats(id) {
        return this.suppliersService.getStats(id);
    }
    async getAnalytics(id, userId) {
        const supplier = await this.prisma.supplier.findUnique({ where: { userId } });
        if (!supplier || supplier.id !== id) {
            throw new common_1.ForbiddenException('Bạn chỉ có thể xem phân tích của chính mình');
        }
        return this.suppliersService.getAnalytics(id);
    }
    async createMyProfile(dto, userId) {
        return this.suppliersService.createProfile(userId, dto);
    }
    async verifySupplier(id, isVerified, adminId) {
        const result = await this.suppliersService.verifySupplier(id, isVerified);
        await this.auditLogService.log({
            userId: adminId,
            action: isVerified ? 'VERIFY_SUPPLIER' : 'UNVERIFY_SUPPLIER',
            targetType: 'Supplier',
            targetId: id,
            targetName: result.companyName,
        });
        return result;
    }
    async update(id, dto, currentUser) {
        if (currentUser.role !== 'ADMIN') {
            const supplier = await this.prisma.supplier.findUnique({
                where: { userId: currentUser.id },
            });
            if (!supplier || supplier.id !== id) {
                throw new common_1.ForbiddenException('Bạn chỉ có thể chỉnh sửa hồ sơ của chính mình');
            }
        }
        return this.suppliersService.update(id, dto);
    }
    async addCertification(id, body, currentUser) {
        if (currentUser.role !== 'ADMIN') {
            const supplier = await this.prisma.supplier.findUnique({
                where: { userId: currentUser.id },
            });
            if (!supplier || supplier.id !== id) {
                throw new common_1.ForbiddenException('Bạn chỉ có thể quản lý chứng nhận của chính mình');
            }
        }
        return this.suppliersService.addCertification(id, body);
    }
    async deleteCertification(supplierId, certId, currentUser) {
        if (currentUser.role !== 'ADMIN') {
            const supplier = await this.prisma.supplier.findUnique({
                where: { userId: currentUser.id },
            });
            if (!supplier || supplier.id !== supplierId) {
                throw new common_1.ForbiddenException('Bạn chỉ có thể quản lý chứng nhận của chính mình');
            }
        }
        return this.suppliersService.deleteCertification(certId, supplierId);
    }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [supplier_dto_1.SupplierQueryDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "getStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Get)(':id/analytics'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Post)('me'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "createMyProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.Put)(':id/verify'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isVerified')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "verifySupplier", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER', 'ADMIN'),
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, supplier_dto_1.UpdateSupplierDto, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER', 'ADMIN'),
    (0, common_1.Post)(':id/certifications'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "addCertification", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER', 'ADMIN'),
    (0, common_1.Delete)(':supplierId/certifications/:certId'),
    __param(0, (0, common_1.Param)('supplierId')),
    __param(1, (0, common_1.Param)('certId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "deleteCertification", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, common_1.Controller)('suppliers'),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService,
        prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map