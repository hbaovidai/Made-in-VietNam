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
const crypto = __importStar(require("crypto"));
let BatchesController = class BatchesController {
    batchesService;
    constructor(batchesService) {
        this.batchesService = batchesService;
    }
    getSupplierBatches(supplierId) {
        return this.batchesService.getSupplierBatches(supplierId);
    }
    getSupplierQRCodes(supplierId) {
        return this.batchesService.getSupplierQRCodes(supplierId);
    }
    createBatch(body) {
        const { supplierId, ...dto } = body;
        return this.batchesService.createBatch(supplierId, dto);
    }
    generateQRCodes(body) {
        const { supplierId, ...dto } = body;
        return this.batchesService.generateQRCodes(supplierId, dto);
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
    (0, common_1.Get)('supplier/:supplierId'),
    __param(0, (0, common_1.Param)('supplierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "getSupplierBatches", null);
__decorate([
    (0, common_1.Get)('supplier/:supplierId/qrcodes'),
    __param(0, (0, common_1.Param)('supplierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "getSupplierQRCodes", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BatchesController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Post)('qr/generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
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
    __metadata("design:paramtypes", [batches_service_1.BatchesService])
], BatchesController);
//# sourceMappingURL=batches.controller.js.map