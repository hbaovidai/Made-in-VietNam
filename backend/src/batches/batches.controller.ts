import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { BatchesService } from './batches.service';
import {
  CreateBatchDto,
  GenerateQRCodesDto,
  VerifyQRDto,
} from './dto/batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import type { Request } from 'express';
import * as crypto from 'crypto';

@Controller('batches')
export class BatchesController {
  constructor(
    private batchesService: BatchesService,
    private prisma: PrismaService,
  ) {}

  // PROTECTED: Supplier chỉ xem batch của mình
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Get('supplier/:supplierId')
  async getSupplierBatches(
    @Param('supplierId') supplierId: string,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier || supplier.id !== supplierId) {
      throw new ForbiddenException('Bạn chỉ xem được lô hàng của mình');
    }
    return this.batchesService.getSupplierBatches(supplierId);
  }

  // PROTECTED: Supplier chỉ xem QR codes của mình
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Get('supplier/:supplierId/qrcodes')
  async getSupplierQRCodes(
    @Param('supplierId') supplierId: string,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier || supplier.id !== supplierId) {
      throw new ForbiddenException('Bạn chỉ xem được QR codes của mình');
    }
    return this.batchesService.getSupplierQRCodes(supplierId);
  }

  // PROTECTED: Chỉ SUPPLIER mới tạo batch — supplierId từ JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Post()
  async createBatch(
    @Body() dto: CreateBatchDto,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    return this.batchesService.createBatch(supplier.id, dto);
  }

  // PROTECTED: Chỉ SUPPLIER mới generate QR — supplierId từ JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Post('qr/generate')
  async generateQRCodes(
    @Body() dto: GenerateQRCodesDto,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    return this.batchesService.generateQRCodes(supplier.id, dto);
  }

  // PUBLIC: Ai cũng quét QR được (đây là tính năng cốt lõi)
  @Post('qr/verify')
  verifyQR(@Body() dto: VerifyQRDto, @Req() req: Request) {
    const rawIp = req.ip || req.connection.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.batchesService.verifyQR(dto.code, dto.token, ipHash, userAgent);
  }
}
