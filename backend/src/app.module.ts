import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { RfqModule } from './rfq/rfq.module';
import { MessagesModule } from './messages/messages.module';
import { InquiryBasketModule } from './inquiry-basket/inquiry-basket.module';
import { BatchesModule } from './batches/batches.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ContactModule } from './contact/contact.module';
import { MembershipsModule } from './memberships/memberships.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    SuppliersModule,
    RfqModule,
    MessagesModule,
    InquiryBasketModule,
    BatchesModule,
    UsersModule,
    NotificationsModule,
    ContactModule,
    MembershipsModule,
    ReportsModule,
    UploadsModule,
  ],
})
export class AppModule {}
