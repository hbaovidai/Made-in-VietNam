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
exports.BatchesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let BatchesService = class BatchesService {
    prisma;
    QR_SECRET = process.env.QR_SECRET || 'mivn5-super-secret-key-for-qr';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSupplierBatches(supplierId) {
        return this.prisma.batch.findMany({
            where: { supplierId },
            include: {
                product: { select: { name: true, slug: true } },
                _count: { select: { qrCodes: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getSupplierQRCodes(supplierId) {
        return this.prisma.qRCode.findMany({
            where: {
                batch: {
                    supplierId: supplierId,
                },
            },
            include: {
                batch: {
                    include: {
                        product: {
                            select: { name: true, slug: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createBatch(supplierId, dto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product || product.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền với sản phẩm này');
        const existing = await this.prisma.batch.findUnique({
            where: { batchNumber: dto.batchNumber },
        });
        if (existing)
            throw new common_1.BadRequestException('Mã lô đã tồn tại');
        return this.prisma.batch.create({
            data: {
                supplierId,
                productId: dto.productId,
                batchNumber: dto.batchNumber,
                manufactureDate: new Date(dto.manufactureDate),
                expiryDate: new Date(dto.expiryDate),
                quantity: dto.quantity,
            },
        });
    }
    async generateQRCodes(supplierId, dto) {
        const batch = await this.prisma.batch.findUnique({
            where: { id: dto.batchId },
        });
        if (!batch || batch.supplierId !== supplierId)
            throw new common_1.ForbiddenException('Không có quyền với lô hàng này');
        if (batch.qrGenerated)
            throw new common_1.BadRequestException('Lô hàng này đã tạo mã QR');
        const codes = Array.from({ length: dto.count }).map((_, index) => {
            const codeId = crypto.randomUUID();
            const secretHash = crypto
                .createHmac('sha256', this.QR_SECRET)
                .update(`${dto.batchId}:${codeId}`)
                .digest('hex');
            return {
                batchId: dto.batchId,
                code: codeId,
                secretHash,
            };
        });
        await this.prisma.qRCode.createMany({ data: codes });
        await this.prisma.batch.update({
            where: { id: dto.batchId },
            data: { qrGenerated: true },
        });
        return {
            message: `Đã tạo thành công ${dto.count} mã QR`,
            codes: codes.map((c) => ({ code: c.code, token: c.secretHash })),
        };
    }
    async verifyQR(code, token, ipHash, userAgent) {
        const qrCode = await this.prisma.qRCode.findUnique({
            where: { code },
            include: {
                batch: {
                    include: {
                        product: true,
                        supplier: { select: { companyName: true, is_verified: true } },
                    },
                },
            },
        });
        if (!qrCode)
            throw new common_1.NotFoundException('Mã QR không tồn tại');
        const expectedHash = crypto
            .createHmac('sha256', this.QR_SECRET)
            .update(`${qrCode.batchId}:${code}`)
            .digest('hex');
        const isValidFormat = token ? expectedHash === token : true;
        const isCompromisedByCount = qrCode.scanCount > qrCode.maxScans;
        await this.prisma.scanEvent.create({
            data: {
                qrCodeId: qrCode.id,
                ipHash: ipHash || 'manual',
                userAgent,
                isValid: isValidFormat,
            },
        });
        await this.prisma.qRCode.update({
            where: { id: qrCode.id },
            data: { scanCount: { increment: 1 } },
        });
        if (!isValidFormat) {
            throw new common_1.BadRequestException('Mã QR giả mạo (Chữ ký không hợp lệ)');
        }
        if (isCompromisedByCount || qrCode.status === 'COMPROMISED') {
            if (qrCode.status === 'ACTIVE') {
                await this.prisma.qRCode.update({
                    where: { id: qrCode.id },
                    data: { status: 'COMPROMISED' },
                });
            }
            return {
                valid: false,
                warning: 'CẢNH BÁO: Mã này đã được quét quá nhiều lần. Có thể là hàng giả bị sao chép mã QR.',
                data: qrCode.batch.product,
            };
        }
        return {
            valid: true,
            data: {
                product: qrCode.batch.product,
                supplier: qrCode.batch.supplier,
                batch: {
                    batchNumber: qrCode.batch.batchNumber,
                    mfgDate: qrCode.batch.manufactureDate,
                    expDate: qrCode.batch.expiryDate,
                },
                scanInfo: {
                    scantCount: qrCode.scanCount + 1,
                    isFirstScan: qrCode.scanCount === 0,
                },
            },
        };
    }
};
exports.BatchesService = BatchesService;
exports.BatchesService = BatchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BatchesService);
//# sourceMappingURL=batches.service.js.map