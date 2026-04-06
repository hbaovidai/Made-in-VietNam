import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto, GenerateQRCodesDto, VerifyQRDto } from './dto/batch.dto';
import * as crypto from 'crypto';

@Injectable()
export class BatchesService {
  private readonly QR_SECRET = process.env.QR_SECRET || 'mivn5-super-secret-key-for-qr';

  constructor(private prisma: PrismaService) {}

  async getSupplierBatches(supplierId: string) {
    return this.prisma.batch.findMany({
      where: { supplierId },
      include: {
        product: { select: { name: true, slug: true } },
        _count: { select: { qrCodes: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSupplierQRCodes(supplierId: string) {
    return this.prisma.qRCode.findMany({
      where: {
        batch: {
          supplierId: supplierId
        }
      },
      include: {
        batch: {
          include: {
            product: {
              select: { name: true, slug: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createBatch(supplierId: string, dto: CreateBatchDto) {
    // Check product ownership
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product || product.supplierId !== supplierId) throw new ForbiddenException('Không có quyền với sản phẩm này');

    // Check batch number uniqueness
    const existing = await this.prisma.batch.findUnique({ where: { batchNumber: dto.batchNumber } });
    if (existing) throw new BadRequestException('Mã lô đã tồn tại');

    return this.prisma.batch.create({
      data: {
        supplierId,
        productId: dto.productId,
        batchNumber: dto.batchNumber,
        manufactureDate: new Date(dto.manufactureDate),
        expiryDate: new Date(dto.expiryDate),
        quantity: dto.quantity
      }
    });
  }

  async generateQRCodes(supplierId: string, dto: GenerateQRCodesDto) {
    const batch = await this.prisma.batch.findUnique({ where: { id: dto.batchId } });
    if (!batch || batch.supplierId !== supplierId) throw new ForbiddenException('Không có quyền với lô hàng này');
    if (batch.qrGenerated) throw new BadRequestException('Lô hàng này đã tạo mã QR');

    // Generate codes with HMAC
    const codes = Array.from({ length: dto.count }).map((_, index) => {
      const codeId = crypto.randomUUID();
      // HMAC signature: HMAC-SHA256(batchId + codeId, Secret)
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
      data: { qrGenerated: true }
    });

    return { message: `Đã tạo thành công ${dto.count} mã QR`, codes: codes.map(c => ({ code: c.code, token: c.secretHash })) };
  }

  async verifyQR(code: string, token?: string, ipHash?: string, userAgent?: string) {
    const qrCode = await this.prisma.qRCode.findUnique({
      where: { code },
      include: {
        batch: {
          include: { product: true, supplier: { select: { companyName: true, isVerified: true } } }
        }
      }
    });

    if (!qrCode) throw new NotFoundException('Mã QR không tồn tại');

    // Validate Cryptographic Token (HMAC) — only when token is provided (real QR scan)
    const expectedHash = crypto
      .createHmac('sha256', this.QR_SECRET)
      .update(`${qrCode.batchId}:${code}`)
      .digest('hex');

    // If token provided, verify it. If no token (manual entry), treat as valid lookup.
    const isValidFormat = token ? (expectedHash === token) : true;

    // Analyze Scans (Anti-counterfeit logic)
    // Rule 1: Too many scans total
    const isCompromisedByCount = qrCode.scanCount > qrCode.maxScans;

    // Record Event
    await this.prisma.scanEvent.create({
      data: {
        qrCodeId: qrCode.id,
        ipHash: ipHash || 'manual',
        userAgent,
        isValid: isValidFormat
      }
    });

    // Update QR scan count
    await this.prisma.qRCode.update({
      where: { id: qrCode.id },
      data: { scanCount: { increment: 1 } }
    });

    if (!isValidFormat) {
      throw new BadRequestException('Mã QR giả mạo (Chữ ký không hợp lệ)');
    }

    if (isCompromisedByCount || qrCode.status === 'COMPROMISED') {
      // If just crossed threshold, mark as compromised
      if (qrCode.status === 'ACTIVE') {
        await this.prisma.qRCode.update({ where: { id: qrCode.id }, data: { status: 'COMPROMISED' } });
      }
      return {
        valid: false,
        warning: 'CẢNH BÁO: Mã này đã được quét quá nhiều lần. Có thể là hàng giả bị sao chép mã QR.',
        data: qrCode.batch.product
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
          expDate: qrCode.batch.expiryDate
        },
        scanInfo: {
          scantCount: qrCode.scanCount + 1, // Include current scan
          isFirstScan: qrCode.scanCount === 0
        }
      }
    };
  }
}
