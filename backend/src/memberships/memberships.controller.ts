import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  // PUBLIC: Xem danh sách gói
  @Get('plans')
  getPlans() {
    return this.membershipsService.getPlans();
  }

  // PROTECTED: Xem subscription của mình
  @UseGuards(JwtAuthGuard)
  @Get('my-subscription/:userId')
  getMySubscription(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    // Chỉ xem subscription của chính mình
    return this.membershipsService.getMySubscription(currentUserId);
  }

  // PROTECTED: Đăng ký gói — userId lấy từ JWT
  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  subscribe(
    @Body() body: { planId: string },
    @CurrentUser('id') userId: string,
  ) {
    return this.membershipsService.subscribe(userId, body.planId);
  }
}
