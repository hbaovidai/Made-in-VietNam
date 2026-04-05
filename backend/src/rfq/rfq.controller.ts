import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RfqService } from './rfq.service';
import { CreateRFQDto, CreateQuoteDto, UpdateRFQStatusDto } from './dto/rfq.dto';

@Controller('rfqs')
export class RfqController {
  constructor(private rfqService: RfqService) {}

  @Get('open')
  getOpenRFQs() {
    return this.rfqService.getOpenRFQs();
  }

  @Get('buyer/:buyerId')
  getBuyerRFQs(@Param('buyerId') buyerId: string) {
    return this.rfqService.getBuyerRFQs(buyerId);
  }

  @Get(':id')
  getRFQDetails(@Param('id') id: string) {
    return this.rfqService.getRFQDetails(id);
  }

  @Post()
  createRFQ(@Body() body: CreateRFQDto & { buyerId: string }) {
    const { buyerId, ...dto } = body;
    return this.rfqService.createRFQ(buyerId, dto);
  }

  @Post('quotes')
  submitQuote(@Body() body: CreateQuoteDto & { supplierId: string }) {
    const { supplierId, ...dto } = body;
    return this.rfqService.submitQuote(supplierId, dto);
  }
}
