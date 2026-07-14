"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding industries for local suppliers...');
    const tn = await prisma.supplier.findUnique({
        where: { slug: 'trung-nguyen-legend' }
    });
    if (tn) {
        const tnIndustries = ['Cà phê & Trà', 'Nông sản'];
        for (const ind of tnIndustries) {
            await prisma.supplierIndustry.upsert({
                where: {
                    supplierId_industry: {
                        supplierId: tn.id,
                        industry: ind
                    }
                },
                update: {},
                create: {
                    supplierId: tn.id,
                    industry: ind
                }
            });
            console.log(`Linked Trung Nguyen Legend to industry: ${ind}`);
        }
    }
    const vm = await prisma.supplier.findUnique({
        where: { slug: 'vinamilk-viet-nam' }
    });
    if (vm) {
        const vmIndustries = ['Sữa & Sản phẩm từ sữa', 'Thực phẩm & Đồ uống'];
        for (const ind of vmIndustries) {
            await prisma.supplierIndustry.upsert({
                where: {
                    supplierId_industry: {
                        supplierId: vm.id,
                        industry: ind
                    }
                },
                update: {},
                create: {
                    supplierId: vm.id,
                    industry: ind
                }
            });
            console.log(`Linked Vinamilk to industry: ${ind}`);
        }
    }
    console.log('Seeding local supplier industries completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-industries.js.map