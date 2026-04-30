import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
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
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Access-Control-Allow-Origin', '*');
        },
      },
    }),
    // Anti-Scraping Firewall: Giới hạn 60 request / 1 phút / 1 IP
    ThrottlerModule.forRoot([{
      ttl: 60000,   // 1 phút (milliseconds)
      limit: 60,    // Tối đa 60 requests
    }]),
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
  providers: [
    // Kích hoạt Rate Limiter toàn cục cho mọi endpoint
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
