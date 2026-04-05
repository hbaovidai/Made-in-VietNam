import { Module } from '@nestjs/common';
import { InquiryBasketController } from './inquiry-basket.controller';
import { InquiryBasketService } from './inquiry-basket.service';

@Module({
  controllers: [InquiryBasketController],
  providers: [InquiryBasketService],
  exports: [InquiryBasketService],
})
export class InquiryBasketModule {}
