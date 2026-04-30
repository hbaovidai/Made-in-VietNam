"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding a demo product...');
    const supplier = await prisma.supplier.findFirst();
    if (!supplier) {
        console.error('No supplier found in the database. Cannot create product.');
        return;
    }
    let category = await prisma.category.findFirst({
        where: { parentId: { not: null } }
    });
    if (!category) {
        category = await prisma.category.findFirst();
    }
    if (!category) {
        console.error('No category found in the database. Cannot create product.');
        return;
    }
    const product = await prisma.product.create({
        data: {
            supplierId: supplier.id,
            categoryId: category.id,
            name: 'Cà Phê Robusta Hạt Rang Nguyên Chất',
            slug: 'ca-phe-robusta-hat-rang-nguyen-chat-demo',
            description: 'Cà phê Robusta nguyên chất 100%, được thu hoạch và chọn lọc kỹ lưỡng từ vùng đất Tây Nguyên. Hạt rang mộc không tẩm ướp, giữ trọn hương vị đậm đà nguyên bản.',
            minPrice: 120000,
            maxPrice: 150000,
            currency: 'VND',
            unit: 'kg',
            moq: 10,
            moqUnit: 'kg',
            images: [
                'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            status: 'ACTIVE',
            rating: 4.8,
            reviewCount: 15,
            viewCount: 120
        }
    });
    console.log(`Successfully created demo product: ${product.name}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-demo-product.js.map