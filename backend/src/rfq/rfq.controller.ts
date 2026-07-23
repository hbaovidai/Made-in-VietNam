import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRFQDto, CreateQuoteDto } from './dto/rfq.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';

import { SupplierStatus } from '@prisma/client';

@Controller('rfqs')
export class RfqController {
  constructor(
    private rfqService: RfqService,
    private prisma: PrismaService,
  ) {}

  // Xem danh sách RFQ mở (Tất cả người dùng đã đăng nhập đều xem được)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER', 'SUPPLIER', 'ADMIN')
  @Get('open')
  async getOpenRFQs(@CurrentUser() currentUser: { id: string; role: string }) {
    let isVerified = true;
    if (currentUser.role === 'SUPPLIER') {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: currentUser.id },
      });
      isVerified = supplier?.status === SupplierStatus.VERIFIED;
    }
    return this.rfqService.getOpenRFQs(isVerified);
  }

  // PROTECTED: Xem RFQ của Buyer (Tự động lấy ID người dùng đăng nhập nếu không phải Admin)
  @UseGuards(JwtAuthGuard)
  @Get('buyer/:buyerId')
  getBuyerRFQs(
    @Param('buyerId') buyerId: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    const targetId =
      currentUser.role === 'ADMIN' && buyerId !== 'me'
        ? buyerId
        : currentUser.id;
    return this.rfqService.getBuyerRFQs(targetId);
  }

  // PROTECTED: Chi tiết RFQ — cần đăng nhập
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getRFQDetails(@Param('id') id: string) {
    return this.rfqService.getRFQDetails(id);
  }

  // PROTECTED: Chỉ BUYER mới tạo RFQ — buyerId lấy từ JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER')
  @Post()
  createRFQ(@Body() dto: CreateRFQDto, @CurrentUser('id') userId: string) {
    return this.rfqService.createRFQ(userId, dto);
  }

  // PROTECTED: Buyer chấp nhận báo giá
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER')
  @Put('quotes/:quoteId/accept')
  acceptQuote(
    @Param('quoteId') quoteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.rfqService.acceptQuote(quoteId, userId);
  }

  // PROTECTED: Chỉ SUPPLIER ĐÃ XÁC THỰC mới báo giá
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Post('quotes')
  async submitQuote(
    @Body() dto: CreateQuoteDto,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    if (supplier.status !== SupplierStatus.VERIFIED)
      throw new ForbiddenException(
        'Chỉ nhà cung cấp đã xác thực mới được gửi báo giá. Vui lòng hoàn tất Xác thực Doanh nghiệp (KYB).',
      );
    return this.rfqService.submitQuote(supplier.id, dto);
  }
}
