"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seed: Không có dữ liệu mẫu.');
    console.log('💡 Tài khoản Admin, Supplier, Buyer: tạo trực tiếp trong database.');
    console.log('💡 Danh mục, sản phẩm: quản lý qua Admin Dashboard.');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map