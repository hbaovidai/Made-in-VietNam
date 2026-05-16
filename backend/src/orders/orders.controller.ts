import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private auditLogService: AuditLogService,
  ) {}

  // ===== ADMIN ENDPOINTS (must be before :id routes) =====

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  async getAllOrders(@Query() query: any) {
    return this.ordersService.getAllOrders(query);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/:id/status')
  async adminUpdateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    const result = await this.ordersService.adminUpdateOrderStatus(id, body.status);
    await this.auditLogService.log({
      userId: req.user.id,
      action: 'UPDATE_ORDER_STATUS',
      targetType: 'Order',
      targetId: id,
      targetName: result.orderNumber,
      details: JSON.stringify({ newStatus: body.status }),
    });
    return result;
  }

  // ===== USER ENDPOINTS =====

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
