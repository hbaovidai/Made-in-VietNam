import {
  Controller,
  Get,
  Post,
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

@Controller('rfqs')
export class RfqController {
  constructor(
    private rfqService: RfqService,
    private prisma: PrismaService,
  ) {}

  // PROTECTED: Chỉ SUPPLIER đã verified mới xem RFQ marketplace
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Get('open')
  async getOpenRFQs(@CurrentUser() currentUser: { id: string; role: string }) {
    if (currentUser.role === 'SUPPLIER') {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: currentUser.id },
      });
      if (!supplier?.isVerified) {
        throw new ForbiddenException(
          'Tài khoản nhà cung cấp chưa được xác minh. Vui lòng hoàn thiện hồ sơ.',
        );
      }
    }
    return this.rfqService.getOpenRFQs();
  }

  // PROTECTED: Buyer chỉ xem RFQ của mình
  @UseGuards(JwtAuthGuard)
  @Get('buyer/:buyerId')
  getBuyerRFQs(
    @Param('buyerId') buyerId: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.id !== buyerId && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn chỉ có thể xem RFQ của chính mình');
    }
    return this.rfqService.getBuyerRFQs(buyerId);
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

  // PROTECTED: Chỉ SUPPLIER mới báo giá — supplierId lấy từ JWT
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
    return this.rfqService.submitQuote(supplier.id, dto);
  }
}
