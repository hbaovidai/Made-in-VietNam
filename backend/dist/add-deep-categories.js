"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const capheLvl2 = await prisma.category.findFirst({ where: { name: 'Cà phê hạt & bột' } });
    if (capheLvl2) {
        const arabica = await prisma.category.upsert({
            where: { name: 'Cà phê Arabica' },
            update: { parentId: capheLvl2.id },
            create: {
                name: 'Cà phê Arabica',
                slug: 'ca-phe-arabica',
                parentId: capheLvl2.id
            }
        });
        const robusta = await prisma.category.upsert({
            where: { name: 'Cà phê Robusta' },
            update: { parentId: capheLvl2.id },
            create: {
                name: 'Cà phê Robusta',
                slug: 'ca-phe-robusta',
                parentId: capheLvl2.id
            }
        });
        await prisma.category.createMany({
            data: [
                { name: 'Cà phê Arabica Cầu Đất', slug: 'ca-phe-arabica-cau-dat', parentId: arabica.id },
                { name: 'Cà phê Arabica Sơn La', slug: 'ca-phe-arabica-son-la', parentId: arabica.id }
            ],
            skipDuplicates: true,
        });
        await prisma.category.createMany({
            data: [
                { name: 'Cà phê Robusta Đắk Lắk', slug: 'ca-phe-robusta-dak-lak', parentId: robusta.id },
                { name: 'Cà phê Robusta Gia Lai', slug: 'ca-phe-robusta-gia-lai', parentId: robusta.id }
            ],
            skipDuplicates: true,
        });
    }
    console.log('✅ Đã thêm các danh mục Level 3 & Level 4 thành công!');
}
main()
    .catch(e => {
    console.error('❌ Lỗi:', e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=add-deep-categories.js.map