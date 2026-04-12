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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchesController = void 0;
const common_1 = require("@nestjs/common");
const batches_service_1 = require("./batches.service");
const batch_dto_1 = require("./dto/batch.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let BatchesController = class BatchesController {
    batchesService;
    prisma;
    constructor(batchesService, prisma) {
        this.batchesService = batchesService;
        this.prisma = prisma;
    }
    async getSupplierBatches(supplierId, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier || supplier.id !== supplierId) {
            throw new common_1.ForbiddenException('Bạn chỉ xem được lô hàng của mình');
        }
        return this.batchesService.getSupplierBatches(supplierId);
    }
    async getSupplierQRCodes(supplierId, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier || supplier.id !== supplierId) {
            throw new common_1.ForbiddenException('Bạn chỉ xem được QR codes của mình');
        }
        return this.batchesService.getSupplierQRCodes(supplierId);
    }
    async createBatch(dto, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier)
            throw new common_1.ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
        return this.batchesService.createBatch(supplier.id, dto);
    }
    async generateQRCodes(dto, userId) {
        const supplier = await this.prisma.supplier.findUnique({
            where: { userId },
        });
        if (!supplier)
            throw new common_1.ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
        return this.batchesService.generateQRCodes(supplier.id, dto);
    }
    verifyQR(dto, req) {
        const rawIp = req.ip || req.connection.remoteAddress || 'unknown';
        const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
        const userAgent = req.headers['user-agent'] || 'unknown';
        return this.batchesService.verifyQR(dto.code, dto.token, ipHash, userAgent);
    }
};
exports.BatchesController = BatchesController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Get)('supplier/:supplierId'),
    __param(0, (0, common_1.Param)('supplierId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getSupplierBatches", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Get)('supplier/:supplierId/qrcodes'),
    __param(0, (0, common_1.Param)('supplierId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getSupplierQRCodes", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_dto_1.CreateBatchDto, String]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "createBatch", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPPLIER'),
    (0, common_1.Post)('qr/generate'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_dto_1.GenerateQRCodesDto, String]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "generateQRCodes", null);
__decorate([
    (0, common_1.Post)('qr/verify'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [batch_dto_1.VerifyQRDto, Object]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "verifyQR", null);
exports.BatchesController = BatchesController = __decorate([
    (0, common_1.Controller)('batches'),
    __metadata("design:paramtypes", [batches_service_1.BatchesService,
        prisma_service_1.PrismaService])
], BatchesController);
//# sourceMappingURL=batches.controller.js.map