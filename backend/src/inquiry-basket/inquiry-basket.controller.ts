import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { InquiryBasketService } from './inquiry-basket.service';
import { AddInquiryItemDto } from './dto/inquiry.dto';

@Controller('inquiry-basket')
export class InquiryBasketController {
  constructor(private inquiryBasketService: InquiryBasketService) {}

  @Get(':userId')
  getBasket(@Param('userId') userId: string) {
    return this.inquiryBasketService.getBasket(userId);
  }

  @Post()
  addItem(@Body() body: AddInquiryItemDto & { userId: string }) {
    const { userId, ...dto } = body;
    return this.inquiryBasketService.addItem(userId, dto);
  }

  @Delete(':itemId')
  removeItem(@Param('itemId') itemId: string, @Body('userId') userId: string) {
    return this.inquiryBasketService.removeItem(itemId, userId);
  }
}
