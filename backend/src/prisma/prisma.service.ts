import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient, SupplierStatus } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to PostgreSQL (Neon)');
    try {
      const result = await this.supplier.updateMany({
        where: {
          status: { not: SupplierStatus.VERIFIED }
        },
        data: {
          status: SupplierStatus.VERIFIED
        }
      });
      console.log(`✅ Auto-verified ${result.count} suppliers on startup.`);
    } catch (err) {
      console.error('Failed to auto-verify suppliers:', err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
