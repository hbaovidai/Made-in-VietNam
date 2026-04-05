import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { CreateBatchDto, GenerateQRCodesDto, VerifyQRDto } from './dto/batch.dto';
import type { Request } from 'express';
import * as crypto from 'crypto';

@Controller('batches')
export class BatchesController {
  constructor(private batchesService: BatchesService) {}

  @Get('supplier/:supplierId')
  getSupplierBatches(@Param('supplierId') supplierId: string) {
    return this.batchesService.getSupplierBatches(supplierId);
  }

  @Post()
  createBatch(@Body() body: CreateBatchDto & { supplierId: string }) {
    const { supplierId, ...dto } = body;
    return this.batchesService.createBatch(supplierId, dto);
  }

  @Post('qr/generate')
  generateQRCodes(@Body() body: GenerateQRCodesDto & { supplierId: string }) {
    const { supplierId, ...dto } = body;
    return this.batchesService.generateQRCodes(supplierId, dto);
  }

  @Post('qr/verify')
  verifyQR(@Body() dto: VerifyQRDto, @Req() req: Request) {
    // Generate simple hash of IP to avoid storing raw IPs
    const rawIp = req.ip || req.connection.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('sha256').update(rawIp).digest('hex');
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.batchesService.verifyQR(dto.code, dto.token, ipHash, userAgent);
  }
}
