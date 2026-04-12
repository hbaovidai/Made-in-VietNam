import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembershipsService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async getMySubscription(userId: string) {
    return this.prisma.userSubscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true },
      orderBy: { endDate: 'desc' },
    });
  }

  async subscribe(userId: string, planId: string) {
    // End any current active subscriptions
    await this.prisma.userSubscription.updateMany({
      where: { userId, status: 'active' },
      data: { status: 'cancelled' },
    });

    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

    return this.prisma.userSubscription.create({
      data: {
        userId,
        planId,
        status: 'active',
        startDate: new Date(),
        endDate,
      },
      include: { plan: true },
    });
  }
}
