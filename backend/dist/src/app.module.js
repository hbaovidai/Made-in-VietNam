"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const serve_static_1 = require("@nestjs/serve-static");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const path_1 = require("path");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const suppliers_module_1 = require("./suppliers/suppliers.module");
const rfq_module_1 = require("./rfq/rfq.module");
const messages_module_1 = require("./messages/messages.module");
const batches_module_1 = require("./batches/batches.module");
const users_module_1 = require("./users/users.module");
const notifications_module_1 = require("./notifications/notifications.module");
const contact_module_1 = require("./contact/contact.module");
const memberships_module_1 = require("./memberships/memberships.module");
const reports_module_1 = require("./reports/reports.module");
const uploads_module_1 = require("./uploads/uploads.module");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const audit_log_module_1 = require("./audit-log/audit-log.module");
const translation_module_1 = require("./translation/translation.module");
const settings_module_1 = require("./settings/settings.module");
const supplier_app_module_1 = require("./supplier_applications/supplier_app.module");
const faq_module_1 = require("./faqs/faq.module");
const json_storage_module_1 = require("./json-storage/json-storage.module");
const legal_module_1 = require("./legal/legal.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
                serveStaticOptions: {
                    setHeaders: (res) => {
                        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                    },
                },
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 60,
                },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            suppliers_module_1.SuppliersModule,
            supplier_app_module_1.SupplierApplicationModule,
            rfq_module_1.RfqModule,
            messages_module_1.MessagesModule,
            batches_module_1.BatchesModule,
            users_module_1.UsersModule,
            notifications_module_1.NotificationsModule,
            contact_module_1.ContactModule,
            memberships_module_1.MembershipsModule,
            reports_module_1.ReportsModule,
            uploads_module_1.UploadsModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            audit_log_module_1.AuditLogModule,
            translation_module_1.TranslationModule,
            settings_module_1.SettingsModule,
            faq_module_1.FaqModule,
            json_storage_module_1.JsonStorageModule,
            legal_module_1.LegalModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map