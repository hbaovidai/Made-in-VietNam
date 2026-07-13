"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const foodBeverage = await prisma.category.findFirst({ where: { name: 'Thực phẩm & Đồ uống' } });
    if (foodBeverage) {
        await prisma.category.createMany({
            data: [
                { name: 'Bánh kẹo', slug: 'banh-keo', parentId: foodBeverage.id },
                { name: 'Nước giải khát', slug: 'nuoc-giai-khat', parentId: foodBeverage.id },
                { name: 'Gia vị & Nước sốt', slug: 'gia-vi-nuoc-sot', parentId: foodBeverage.id }
            ],
            skipDuplicates: true,
        });
    }
    const agriculture = await prisma.category.findFirst({ where: { name: 'Nông sản Việt Nam' } });
    if (agriculture) {
        await prisma.category.createMany({
            data: [
                { name: 'Cà phê hạt & bột', slug: 'ca-phe-hat-bot', parentId: agriculture.id },
                { name: 'Trà xanh & Trà thảo mộc', slug: 'tra-xanh-tra-thao-moc', parentId: agriculture.id },
                { name: 'Hạt điều & Hạt tiêu', slug: 'hat-dieu-hat-tieu', parentId: agriculture.id },
                { name: 'Gạo & Ngũ cốc', slug: 'gao-ngu-coc', parentId: agriculture.id }
            ],
            skipDuplicates: true,
        });
    }
    const handicraft = await prisma.category.findFirst({ where: { name: 'Thủ công mỹ nghệ' } });
    if (handicraft) {
        await prisma.category.createMany({
            data: [
                { name: 'Đồ gốm sứ', slug: 'do-gom-su', parentId: handicraft.id },
                { name: 'Mây tre đan', slug: 'may-tre-dan', parentId: handicraft.id },
                { name: 'Tranh sơn mài', slug: 'tranh-son-mai', parentId: handicraft.id }
            ],
            skipDuplicates: true,
        });
    }
    const fashion = await prisma.category.findFirst({ where: { name: 'Thời trang & Dệt may' } });
    if (fashion) {
        await prisma.category.createMany({
            data: [
                { name: 'Quần áo nam nữ', slug: 'quan-ao-nam-nu', parentId: fashion.id },
                { name: 'Vải vóc & Sợi dệt', slug: 'vai-voc-soi-det', parentId: fashion.id },
                { name: 'Giày dép & Túi xách', slug: 'giay-dep-tui-xach', parentId: fashion.id }
            ],
            skipDuplicates: true,
        });
    }
    console.log('✅ Đã thêm các danh mục con thành công!');
}
main()
    .catch(e => {
    console.error('❌ Thất bại:', e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=add-child-categories.js.map