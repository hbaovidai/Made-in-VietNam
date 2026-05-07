import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @Request() req: any,
    @Body() body: {
      recipientName: string;
      recipientPhone: string;
      shippingAddress: string;
      note?: string;
      paymentMethod?: 'COD' | 'BANK_TRANSFER';
    },
  ) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  @Get('buyer')
  async getBuyerOrders(@Request() req: any) {
    return this.ordersService.getBuyerOrders(req.user.id);
  }

  @Get('supplier')
  async getSupplierOrders(@Request() req: any) {
    return this.ordersService.getSupplierOrders(req.user.id);
  }

  @Get(':id')
  async getOrderDetail(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.getOrderDetail(req.user.id, id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'DELIVERED' },
  ) {
    return this.ordersService.updateOrderStatus(req.user.id, id, body.status);
  }

  @Patch(':id/cancel')
  async cancelOrder(@Request() req: any, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.id, id);
  }
}
