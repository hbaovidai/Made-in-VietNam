"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const passwordHash = await bcrypt.hash('123456', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@vieproduct.com' },
        update: {},
        create: {
            email: 'admin@vieproduct.com',
            passwordHash,
            fullName: 'Admin VIEProduct',
            role: 'ADMIN',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Admin:', admin.email);
    const supplierUser = await prisma.user.upsert({
        where: { email: 'supplier@example.com' },
        update: {},
        create: {
            email: 'supplier@example.com',
            passwordHash,
            fullName: 'Nhà cung cấp mẫu',
            role: 'SUPPLIER',
            status: 'ACTIVE',
        },
    });
    await prisma.supplier.upsert({
        where: { userId: supplierUser.id },
        update: {},
        create: {
            userId: supplierUser.id,
            companyName: 'Công ty TNHH Mẫu',
            slug: 'cong-ty-mau',
            description: 'Tài khoản nhà cung cấp mẫu.',
            businessType: 'manufacturer',
            city: 'TP. Hồ Chí Minh',
            province: 'TP. Hồ Chí Minh',
            isVerified: false,
            verificationStatus: 'UNVERIFIED',
        },
    });
    console.log('✅ Supplier:', supplierUser.email);
    const buyer = await prisma.user.upsert({
        where: { email: 'buyer@example.com' },
        update: {},
        create: {
            email: 'buyer@example.com',
            passwordHash,
            fullName: 'Người mua mẫu',
            role: 'BUYER',
            status: 'ACTIVE',
        },
    });
    console.log('✅ Buyer:', buyer.email);
    console.log('\n🎉 Done! Password: 123456');
    console.log('⚠️  Hãy đổi password sau khi đăng nhập!');
    console.log('⚠️  Xoá file này sau khi chạy xong: rm prisma/init-accounts.ts');
}
main()
    .catch((e) => {
    console.error('❌ Failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=init-accounts.js.map