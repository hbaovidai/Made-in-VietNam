import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MembershipsService } from './memberships.service';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get('plans')
  getPlans() {
    return this.membershipsService.getPlans();
  }

  @Get('my-subscription/:userId')
  getMySubscription(@Param('userId') userId: string) {
    return this.membershipsService.getMySubscription(userId);
  }

  @Post('subscribe')
  subscribe(@Body() body: { userId: string; planId: string }) {
    return this.membershipsService.subscribe(body.userId, body.planId);
  }
}
