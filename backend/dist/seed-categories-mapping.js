"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding categories mapping for suppliers...');
    const tnCategories = ['ca-phe-hat-bot', 'ca-phe-robusta', 'ca-phe-arabica'];
    for (const catSlug of tnCategories) {
        const category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (category) {
            await prisma.supplierCategoryMap.upsert({
                where: {
                    categorySlug_supplierSlug: {
                        categorySlug: catSlug,
                        supplierSlug: 'trung-nguyen-legend',
                    },
                },
                update: {},
                create: {
                    categorySlug: catSlug,
                    supplierSlug: 'trung-nguyen-legend',
                    categoryLevel: 1,
                },
            });
            console.log(`Mapped Trung Nguyen to ${catSlug}`);
        }
    }
    const vmCategories = ['thuc-pham-do-uong', 'banh-keo', 'nuoc-giai-khat'];
    for (const catSlug of vmCategories) {
        const category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (category) {
            await prisma.supplierCategoryMap.upsert({
                where: {
                    categorySlug_supplierSlug: {
                        categorySlug: catSlug,
                        supplierSlug: 'vinamilk-viet-nam',
                    },
                },
                update: {},
                create: {
                    categorySlug: catSlug,
                    supplierSlug: 'vinamilk-viet-nam',
                    categoryLevel: 1,
                },
            });
            console.log(`Mapped Vinamilk to ${catSlug}`);
        }
    }
    console.log('Categories mapping seeding completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-categories-mapping.js.map