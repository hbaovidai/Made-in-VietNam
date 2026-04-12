import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { InquiryBasketService } from './inquiry-basket.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('inquiry-basket')
export class InquiryBasketController {
  constructor(private inquiryBasketService: InquiryBasketService) {}

  // PROTECTED: Buyer chỉ xem giỏ của mình
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER')
  @Get(':userId')
  getBasket(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (currentUserId !== userId)
      throw new ForbiddenException('Không có quyền');
    return this.inquiryBasketService.getBasket(userId);
  }

  // PROTECTED: Buyer thêm item — userId từ JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER')
  @Post()
  addItem(@Body() dto: AddInquiryItemDto, @CurrentUser('id') userId: string) {
    return this.inquiryBasketService.addItem(userId, dto);
  }

  // PROTECTED: Buyer xoá item — userId từ JWT
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('BUYER')
  @Delete(':itemId')
  removeItem(
    @Param('itemId') itemId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.inquiryBasketService.removeItem(itemId, userId);
  }
}
