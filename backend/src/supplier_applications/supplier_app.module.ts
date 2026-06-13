import { Module } from '@nestjs/common';
import { SupplierApplicationController } from './supplier_app.controller';
import { SupplierApplicationService } from './supplier_app.service';

@Module({
  controllers: [SupplierApplicationController],
  providers: [SupplierApplicationService],
  exports: [SupplierApplicationService],
})
export class SupplierApplicationModule {}
